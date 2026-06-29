import Link from "next/link";
import { Github, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col items-center space-y-4 text-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-rose-500 to-pink-500 text-white">
            <Code2 className="h-4 w-4" />
          </span>
          <span className="font-bold tracking-tight">
            Code<span className="text-rose-500">Nest</span>
          </span>
        </Link>

        <Link
          href="https://github.com/AkGoyal2111/VibeCodeEditor"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <Github className="w-4 h-4" />
          AkGoyal2111/VibeCodeEditor
        </Link>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Built by{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            AkGoyal
          </span>{" "}
          · &copy; {new Date().getFullYear()} CodeNest
        </p>
      </div>
    </footer>
  );
}
