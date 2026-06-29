/**
 * Types for the collaborative DSA (Data Structures & Algorithms) practice
 * feature. Problems are static, curated content; the editor on top of each
 * problem is shared in real time via the existing collaboration layer.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

export type DsaLanguage = "javascript" | "typescript" | "python" | "java" | "cpp";

export interface DsaExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface DsaProblem {
  /** URL-safe identifier, also used as the collaboration room id. */
  slug: string;
  title: string;
  difficulty: Difficulty;
  /** High-level category, e.g. "Arrays", "Graphs", "Dynamic Programming". */
  topic: string;
  /** Markdown problem statement. */
  statement: string;
  examples: DsaExample[];
  constraints: string[];
  /** Optional progressive hints, revealed one at a time. */
  hints?: string[];
  /** Starter code per language. */
  starterCode: Partial<Record<DsaLanguage, string>>;
}

export const DSA_LANGUAGES: { id: DsaLanguage; label: string; monaco: string }[] =
  [
    { id: "javascript", label: "JavaScript", monaco: "javascript" },
    { id: "typescript", label: "TypeScript", monaco: "typescript" },
    { id: "python", label: "Python", monaco: "python" },
    { id: "java", label: "Java", monaco: "java" },
    { id: "cpp", label: "C++", monaco: "cpp" },
  ];

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: "text-emerald-500",
  Medium: "text-amber-500",
  Hard: "text-rose-500",
};
