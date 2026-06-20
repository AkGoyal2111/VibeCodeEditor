"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, Github, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPlayground } from "../actions";

const AddRepo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const extractRepoName = (url: string) => {
    try {
      const parts = url.replace(/\.git$/, "").split("/");
      return parts[parts.length - 1] || "";
    } catch {
      return "";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setRepoUrl(url);
    if (!projectName) {
      setProjectName(extractRepoName(url));
    }
  };

  const isValidGithubUrl = (url: string) => {
    return /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/.test(url.trim());
  };

  const handleOpen = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }
    if (!isValidGithubUrl(repoUrl)) {
      toast.error("Please enter a valid GitHub repository URL (e.g. https://github.com/user/repo)");
      return;
    }

    setIsLoading(true);
    try {
      // Create a playground using React template as the base, with repo URL in description
      const name = projectName || extractRepoName(repoUrl) || "GitHub Repo";
      const res = await createPlayground({
        title: name,
        template: "REACT",
        description: `github:${repoUrl.trim()}`,
      });
      toast.success(`Opening repository: ${name}`);
      setIsOpen(false);
      setRepoUrl("");
      setProjectName("");
      router.push(`/playground/${res?.id}`);
    } catch (error) {
      toast.error("Failed to open repository. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-background hover:border-[#E93F3F] hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#E93F3F] group-hover:text-[#E93F3F] transition-colors duration-300"
            size={"icon"}
          >
            <ArrowDown size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#e93f3f]">Open Github Repository</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Work with your repositories in our editor</p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/github.svg"}
            alt="Open GitHub repository"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setIsOpen(false); setRepoUrl(""); setProjectName(""); } }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#e93f3f] flex items-center gap-2">
              <Github size={22} />
              Open GitHub Repository
            </DialogTitle>
            <DialogDescription>
              Enter a public GitHub repository URL to open it in the editor
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="repo-url">Repository URL</Label>
              <Input
                id="repo-url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={handleUrlChange}
                disabled={isLoading}
              />
              {repoUrl && !isValidGithubUrl(repoUrl) && (
                <p className="text-xs text-red-500">Please enter a valid GitHub URL</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="repo-name">Project Name <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="repo-name"
                placeholder="my-project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              className="bg-[#E93F3F] hover:bg-[#d03636] text-white"
              onClick={handleOpen}
              disabled={isLoading || !repoUrl.trim()}
            >
              {isLoading ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> Opening...</>
              ) : (
                <>Open Repository</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddRepo;
