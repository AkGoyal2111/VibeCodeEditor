import type { Metadata } from "next";
import ProblemList from "@/modules/dsa/components/problem-list";

export const metadata: Metadata = {
  title: "Collaborative DSA – CodeNest",
  description:
    "Practice data structures & algorithms together in real time: shared editor, video call and whiteboard.",
};

export default function DsaIndexPage() {
  return <ProblemList />;
}
