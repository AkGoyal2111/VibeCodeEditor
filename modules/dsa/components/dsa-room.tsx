"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Lightbulb,
  RotateCcw,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  DSA_LANGUAGES,
  DIFFICULTY_COLOR,
  type DsaLanguage,
  type DsaProblem,
} from "../types";
import { useCollaboration } from "@/modules/collaboration/hooks/useCollaboration";
import CollaboratorsPresence from "@/modules/collaboration/components/collaborators-presence";
import ShareButton from "@/modules/collaboration/components/share-button";
import CollaborationPanel from "@/modules/collaboration/components/collaboration-panel";
import type { RemoteCodeChange } from "@/modules/collaboration/types";
import { useCurrentUser } from "@/modules/auth/hooks/use-current-user";

interface DsaRoomProps {
  problem: DsaProblem;
}

/**
 * A collaborative coding room for a single DSA problem. The problem statement
 * sits on the left; a shared Monaco editor on the right is synced in real time
 * through the existing collaboration layer (room id `dsa-<slug>`). Each language
 * is treated as its own shared document so switching language is non-destructive.
 */
export default function DsaRoom({ problem }: DsaRoomProps) {
  const roomId = `dsa-${problem.slug}`;
  const currentUser = useCurrentUser();

  const [language, setLanguage] = useState<DsaLanguage>("javascript");
  const [isCollabPanelOpen, setIsCollabPanelOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  // Per-language code, seeded from the problem's starter code.
  const [codeByLang, setCodeByLang] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {};
    for (const { id } of DSA_LANGUAGES) {
      seed[id] = problem.starterCode[id] ?? "// Start coding...\n";
    }
    return seed;
  });

  const monacoLang =
    DSA_LANGUAGES.find((l) => l.id === language)?.monaco ?? "javascript";

  // Tracks the last content applied from a peer per language, so the resulting
  // editor onChange is recognised as an echo and not rebroadcast.
  const lastRemoteRef = useRef<Map<string, string>>(new Map());

  const handleRemoteCodeChange = useCallback((change: RemoteCodeChange) => {
    // fileId carries the language for DSA rooms.
    lastRemoteRef.current.set(change.fileId, change.content);
    setCodeByLang((prev) => ({ ...prev, [change.fileId]: change.content }));
  }, []);

  const collabUser = useMemo(
    () =>
      currentUser?.id
        ? {
            id: currentUser.id,
            name: currentUser.name || currentUser.email || "Anonymous",
            image: currentUser.image ?? undefined,
          }
        : null,
    [currentUser?.id, currentUser?.name, currentUser?.email, currentUser?.image]
  );

  const { isConnected, collaborators, broadcastCodeChange, setActiveFile } =
    useCollaboration({
      roomId,
      user: collabUser,
      onRemoteCodeChange: handleRemoteCodeChange,
    });

  // Broadcast which language doc the user is on for presence.
  useEffect(() => {
    setActiveFile(language, `${problem.title} · ${language}`);
  }, [language, problem.title, setActiveFile]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const content = value ?? "";
      const echoed = lastRemoteRef.current.get(language) === content;
      if (echoed) {
        lastRemoteRef.current.delete(language);
      } else {
        broadcastCodeChange(language, content);
      }
      setCodeByLang((prev) => ({ ...prev, [language]: content }));
    },
    [language, broadcastCodeChange]
  );

  const resetCode = useCallback(() => {
    const starter = problem.starterCode[language] ?? "// Start coding...\n";
    broadcastCodeChange(language, starter);
    setCodeByLang((prev) => ({ ...prev, [language]: starter }));
  }, [language, problem.starterCode, broadcastCodeChange]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <Button asChild size="sm" variant="ghost">
          <Link href="/dsa">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Problems
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h1 className="truncate text-sm font-semibold">{problem.title}</h1>
          <span
            className={`text-xs font-medium ${DIFFICULTY_COLOR[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
          <span className="hidden rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline">
            {problem.topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CollaboratorsPresence
            collaborators={collaborators}
            isConnected={isConnected}
          />
          <ShareButton />
          <Button
            size="sm"
            variant={isCollabPanelOpen ? "secondary" : "outline"}
            onClick={() => setIsCollabPanelOpen((v) => !v)}
          >
            <Users className="mr-2 h-4 w-4" />
            Collaborate
          </Button>
        </div>
      </header>

      {/* Body */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Problem statement */}
        <ResizablePanel defaultSize={42} minSize={25}>
          <div className="h-full overflow-y-auto p-6">
            <article className="space-y-3 text-sm leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.8125rem] [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.statement}
              </ReactMarkdown>

              <h3>Examples</h3>
              {problem.examples.map((ex, i) => (
                <div
                  key={i}
                  className="my-3 rounded-md border bg-muted/40 p-3 text-sm"
                >
                  <div>
                    <span className="font-semibold">Input:</span>{" "}
                    <code>{ex.input}</code>
                  </div>
                  <div>
                    <span className="font-semibold">Output:</span>{" "}
                    <code>{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <div className="mt-1 text-muted-foreground">
                      <span className="font-semibold">Explanation:</span>{" "}
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}

              <h3>Constraints</h3>
              <ul>
                {problem.constraints.map((c, i) => (
                  <li key={i}>
                    <code>{c}</code>
                  </li>
                ))}
              </ul>

              {problem.hints && problem.hints.length > 0 && (
                <div className="mt-4">
                  <h3 className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Hints
                  </h3>
                  {problem.hints.slice(0, revealedHints).map((h, i) => (
                    <div
                      key={i}
                      className="my-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm"
                    >
                      {h}
                    </div>
                  ))}
                  {revealedHints < problem.hints.length && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRevealedHints((n) => n + 1)}
                    >
                      Reveal hint {revealedHints + 1} of {problem.hints.length}
                    </Button>
                  )}
                </div>
              )}
            </article>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Collaborative editor */}
        <ResizablePanel defaultSize={58} minSize={30}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="flex items-center gap-1">
                {DSA_LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                      language === l.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="ghost" onClick={resetCode}>
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={monacoLang}
                theme="vs-dark"
                value={codeByLang[language] ?? ""}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  automaticLayout: true,
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <CollaborationPanel
        roomId={roomId}
        open={isCollabPanelOpen}
        onClose={() => setIsCollabPanelOpen(false)}
        enabled={isConnected}
        collaborators={collaborators}
        isConnected={isConnected}
      />
    </div>
  );
}
