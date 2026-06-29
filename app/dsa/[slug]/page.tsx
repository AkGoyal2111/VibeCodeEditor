import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProblemBySlug } from "@/modules/dsa/data/problems";
import DsaRoom from "@/modules/dsa/components/dsa-room";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  return {
    title: problem
      ? `${problem.title} – Collaborative DSA`
      : "Problem not found",
  };
}

export default async function DsaProblemPage({ params }: PageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  return <DsaRoom problem={problem} />;
}
