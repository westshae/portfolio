"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProjectEditorPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const projectId = params.get("id");

  const [title, setTitle] = useState("");
  const [tldr, setTldr] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [articleId, setArticleId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
  }, [status, router]);

  useEffect(() => {
    const load = async () => {
      if (!projectId) return;
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const p = await res.json();
        setTitle(p.title ?? "");
        setTldr(p.tldr ?? "");
        setRepoUrl(p.repoUrl ?? "");
        setArticleId(p.articleId ? String(p.articleId) : "");
      }
      setLoading(false);
    };
    load();
  }, [projectId]);

  const create = async () => {
    setLoading(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, tldr, repoUrl: repoUrl || null, articleId: articleId ? Number(articleId) : null, published: false }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.replace(`/admin/projects/editor?id=${data.id}`);
    }
  };

  const save = async () => {
    if (!projectId) return;
    setLoading(true);
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, tldr, repoUrl: repoUrl || null, articleId: articleId ? Number(articleId) : null }),
    });
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Project Editor</h1>
        <Button variant="outline" onClick={() => router.push("/admin/projects")}>Back to list</Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
      </div>
      <div className="space-y-2">
        <label className="text-sm">TLDR</label>
        <Input value={tldr} onChange={(e) => setTldr(e.target.value)} placeholder="Short description" />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Repo URL (optional)</label>
        <Input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/..." />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Article ID (optional)</label>
        <Input value={articleId} onChange={(e) => setArticleId(e.target.value)} placeholder="e.g. 1" />
      </div>

      <div className="flex gap-2">
        {!projectId ? (
          <Button onClick={create} disabled={loading || !title || !tldr}>Create</Button>
        ) : (
          <Button onClick={save} disabled={loading || !title || !tldr}>Save</Button>
        )}
      </div>
    </div>
  );
}


