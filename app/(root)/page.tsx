import { Button } from "@/components/ui/button";
import { ArrowUpRight, Users, Sparkles, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  { icon: Users, label: "Live multiplayer editing" },
  { icon: Sparkles, label: "AI completion & chat" },
  { icon: Video, label: "Built-in video calls" },
];

export default function Home() {
  return (
    <div className="z-20 flex flex-col items-center justify-start min-h-screen py-2 mt-10">
      <div className="flex flex-col justify-center items-center my-5">
        <Image src={"/hero.svg"} alt="Hero" height={460} width={460} priority />

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 px-4 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Browser-based IDE · no setup needed
        </span>

        <h1 className="z-20 text-5xl sm:text-6xl mt-6 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 dark:from-rose-400 dark:via-red-400 dark:to-pink-400 tracking-tight leading-[1.2]">
          Code together,
          <br />
          in real time.
        </h1>
      </div>

      <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400 px-5 max-w-2xl">
        CodeNest is an AI-powered, collaborative code editor that runs entirely
        in your browser. Spin up a project, share a link, and write, debug and
        solve DSA problems together — with live editing, video calls and a shared
        whiteboard.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {features.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 px-3.5 py-1.5 text-sm text-zinc-700 dark:text-zinc-300"
          >
            <Icon className="h-4 w-4 text-rose-500" />
            {label}
          </span>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3">
        <Link href={"/dashboard"}>
          <Button variant={"brand"} size={"lg"}>
            Get Started
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <Link href={"/dsa"}>
          <Button variant={"outline"} size={"lg"}>
            Try DSA Rooms
          </Button>
        </Link>
      </div>
    </div>
  );
}
