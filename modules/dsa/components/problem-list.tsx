"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Code2, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DSA_PROBLEMS } from "../data/problems";
import { DIFFICULTY_COLOR, type Difficulty } from "../types";

const DIFFICULTIES: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];

export default function ProblemList() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DSA_PROBLEMS.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q);
      const matchesDiff = difficulty === "All" || p.difficulty === difficulty;
      return matchesQuery && matchesDiff;
    });
  }, [query, difficulty]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Code2 className="h-6 w-6 text-primary" />
          Collaborative DSA
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          Pick a problem, then share the URL to solve it together in real time —
          live code sync, video call and a shared whiteboard.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problems or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                difficulty === d
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <ul className="divide-y rounded-lg border">
        {filtered.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/dsa/${p.slug}`}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.topic}</div>
              </div>
              <span
                className={`text-xs font-semibold ${DIFFICULTY_COLOR[p.difficulty]}`}
              >
                {p.difficulty}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">
            No problems match your filters.
          </li>
        )}
      </ul>
    </div>
  );
}
