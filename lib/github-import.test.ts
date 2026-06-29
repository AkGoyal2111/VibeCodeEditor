import { describe, it, expect } from "vitest";
import {
  parseGithubUrl,
  shouldIgnorePath,
  splitFilename,
  buildTemplateTree,
} from "./github-import";
import type { TemplateFolder } from "@/modules/playground/lib/path-to-json";

describe("parseGithubUrl", () => {
  it("parses owner/repo from a standard URL", () => {
    expect(parseGithubUrl("https://github.com/vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("strips a trailing .git and slash", () => {
    expect(parseGithubUrl("https://github.com/user/repo.git/")).toEqual({
      owner: "user",
      repo: "repo",
    });
  });

  it("accepts www and http", () => {
    expect(parseGithubUrl("http://www.github.com/a/b")).toEqual({
      owner: "a",
      repo: "b",
    });
  });

  it("rejects non-GitHub or malformed URLs", () => {
    expect(parseGithubUrl("https://gitlab.com/a/b")).toBeNull();
    expect(parseGithubUrl("https://github.com/onlyowner")).toBeNull();
    expect(parseGithubUrl("not a url")).toBeNull();
  });
});

describe("shouldIgnorePath", () => {
  it("ignores dependency and build directories anywhere in the path", () => {
    expect(shouldIgnorePath("node_modules/react/index.js")).toBe(true);
    expect(shouldIgnorePath("packages/app/dist/bundle.js")).toBe(true);
    expect(shouldIgnorePath(".git/config")).toBe(true);
  });

  it("ignores binary/asset extensions", () => {
    expect(shouldIgnorePath("public/logo.png")).toBe(true);
    expect(shouldIgnorePath("fonts/Inter.woff2")).toBe(true);
    expect(shouldIgnorePath("pnpm-lock.lock")).toBe(true);
  });

  it("keeps normal source files", () => {
    expect(shouldIgnorePath("src/index.ts")).toBe(false);
    expect(shouldIgnorePath("README.md")).toBe(false);
    expect(shouldIgnorePath("app/page.tsx")).toBe(false);
  });
});

describe("splitFilename", () => {
  it("splits name and extension", () => {
    expect(splitFilename("index.ts")).toEqual({
      filename: "index",
      fileExtension: "ts",
    });
  });

  it("treats dotfiles as having no extension", () => {
    expect(splitFilename(".gitignore")).toEqual({
      filename: ".gitignore",
      fileExtension: "",
    });
  });

  it("uses the last dot for multi-dot names", () => {
    expect(splitFilename("a.test.tsx")).toEqual({
      filename: "a.test",
      fileExtension: "tsx",
    });
  });
});

describe("buildTemplateTree", () => {
  it("nests files into folders by path", () => {
    const tree = buildTemplateTree("repo", [
      { path: "README.md", content: "# Hi" },
      { path: "src/index.ts", content: "export {}" },
      { path: "src/utils/math.ts", content: "export const add = 1" },
    ]);

    expect(tree.folderName).toBe("repo");

    // root has README.md and a src folder
    const names = tree.items.map((i) =>
      "folderName" in i ? i.folderName : `${i.filename}.${i.fileExtension}`
    );
    expect(names).toContain("README.md");
    expect(names).toContain("src");

    const src = tree.items.find(
      (i): i is TemplateFolder => "folderName" in i && i.folderName === "src"
    )!;
    const srcNames = src.items.map((i) =>
      "folderName" in i ? i.folderName : `${i.filename}.${i.fileExtension}`
    );
    expect(srcNames).toContain("index.ts");
    expect(srcNames).toContain("utils");
  });

  it("reuses a folder for sibling files instead of duplicating it", () => {
    const tree = buildTemplateTree("repo", [
      { path: "src/a.ts", content: "" },
      { path: "src/b.ts", content: "" },
    ]);
    const folders = tree.items.filter((i) => "folderName" in i);
    expect(folders).toHaveLength(1);
  });
});
