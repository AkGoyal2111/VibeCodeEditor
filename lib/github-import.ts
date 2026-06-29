/**
 * Imports a public GitHub repository into the editor's TemplateFolder format.
 *
 * Strategy (no auth needed for public repos):
 *   1. One call to the Git Trees API to list every path in the default branch.
 *   2. Fetch each kept file's content from the raw CDN (raw.githubusercontent.com),
 *      which is a CDN and does NOT count against the 60 req/hr API rate limit.
 *   3. Assemble the flat path list into a nested TemplateFolder tree.
 *
 * To stay safe on large repos we skip dependency/build/binary files and cap the
 * number and size of files imported.
 */
import type {
  TemplateFile,
  TemplateFolder,
} from "@/modules/playground/lib/path-to-json";

export interface ParsedRepo {
  owner: string;
  repo: string;
}

export interface ImportLimits {
  maxFiles: number;
  maxFileBytes: number;
}

export const DEFAULT_IMPORT_LIMITS: ImportLimits = {
  maxFiles: 300,
  maxFileBytes: 200_000, // 200 KB per file
};

/** Directories whose contents are never useful to import. */
const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  ".turbo",
  ".cache",
  "coverage",
  ".vercel",
  ".idea",
  ".vscode",
  "vendor",
  "__pycache__",
]);

/** Binary / non-text extensions we skip (content would be meaningless). */
const BINARY_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "ico", "bmp", "tiff", "svg",
  "woff", "woff2", "ttf", "eot", "otf",
  "mp3", "mp4", "mov", "avi", "webm", "wav", "ogg",
  "zip", "gz", "tar", "rar", "7z",
  "pdf", "exe", "dll", "so", "dylib", "bin", "wasm",
  "lock", "psd", "sketch",
]);

/**
 * Parse a GitHub repo URL into owner/repo. Returns null if it isn't a valid
 * `https://github.com/<owner>/<repo>` URL.
 */
export function parseGithubUrl(url: string): ParsedRepo | null {
  const match = url
    .trim()
    .replace(/\/+$/, "") // drop trailing slash(es) first
    .replace(/\.git$/, "") // then a trailing .git
    .match(/^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

/** Whether a repo-relative path should be skipped during import. */
export function shouldIgnorePath(path: string): boolean {
  const segments = path.split("/");
  if (segments.some((seg) => IGNORED_DIRS.has(seg))) return true;
  const ext = segments[segments.length - 1].split(".").pop()?.toLowerCase();
  if (ext && BINARY_EXTENSIONS.has(ext)) return true;
  return false;
}

/** Split a filename into base name + extension as the editor expects. */
export function splitFilename(name: string): {
  filename: string;
  fileExtension: string;
} {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return { filename: name, fileExtension: "" };
  return {
    filename: name.slice(0, dot),
    fileExtension: name.slice(dot + 1),
  };
}

/**
 * Build a nested TemplateFolder from a flat list of `{ path, content }` files.
 * Pure and dependency-free so it can be unit tested.
 */
export function buildTemplateTree(
  rootName: string,
  files: { path: string; content: string }[]
): TemplateFolder {
  const root: TemplateFolder = { folderName: rootName, items: [] };

  for (const file of files) {
    const parts = file.path.split("/");
    const fileName = parts.pop()!;
    let cursor = root;

    for (const dir of parts) {
      let next = cursor.items.find(
        (i): i is TemplateFolder =>
          "folderName" in i && i.folderName === dir
      );
      if (!next) {
        next = { folderName: dir, items: [] };
        cursor.items.push(next);
      }
      cursor = next;
    }

    const { filename, fileExtension } = splitFilename(fileName);
    const templateFile: TemplateFile = {
      filename,
      fileExtension,
      content: file.content,
    };
    cursor.items.push(templateFile);
  }

  return root;
}

interface GitTreeEntry {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

/**
 * Fetch a repository and return it as a TemplateFolder. Throws a user-friendly
 * Error on failure (repo not found, empty, rate limited, etc.).
 */
export async function importGithubRepoToTemplate(
  url: string,
  limits: ImportLimits = DEFAULT_IMPORT_LIMITS
): Promise<{ tree: TemplateFolder; importedFiles: number; skipped: number }> {
  const parsed = parseGithubUrl(url);
  if (!parsed) {
    throw new Error("Invalid GitHub repository URL.");
  }
  const { owner, repo } = parsed;

  // 1. Look up the default branch.
  const repoRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (repoRes.status === 404) {
    throw new Error("Repository not found or is private.");
  }
  if (repoRes.status === 403) {
    throw new Error(
      "GitHub rate limit reached. Please try again in a few minutes."
    );
  }
  if (!repoRes.ok) {
    throw new Error(`GitHub API error (${repoRes.status}).`);
  }
  const repoInfo = await repoRes.json();
  const branch: string = repoInfo.default_branch || "main";

  // 2. Fetch the full file tree in one request.
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: { Accept: "application/vnd.github+json" } }
  );
  if (!treeRes.ok) {
    throw new Error(`Failed to read repository tree (${treeRes.status}).`);
  }
  const treeData = await treeRes.json();
  const entries: GitTreeEntry[] = Array.isArray(treeData.tree)
    ? treeData.tree
    : [];

  const blobs = entries.filter(
    (e) =>
      e.type === "blob" &&
      !shouldIgnorePath(e.path) &&
      (e.size ?? 0) <= limits.maxFileBytes
  );

  let skipped = entries.filter((e) => e.type === "blob").length - blobs.length;

  const kept = blobs.slice(0, limits.maxFiles);
  skipped += blobs.length - kept.length;

  if (kept.length === 0) {
    throw new Error("No importable text files found in this repository.");
  }

  // 3. Fetch file contents from the raw CDN (does not hit the API rate limit).
  const files = await Promise.all(
    kept.map(async (entry) => {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${entry.path}`
      );
      const content = rawRes.ok ? await rawRes.text() : "";
      return { path: entry.path, content };
    })
  );

  const tree = buildTemplateTree(repo, files);
  return { tree, importedFiles: files.length, skipped };
}
