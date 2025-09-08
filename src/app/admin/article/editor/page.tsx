"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Block = { id?: number; type: "header" | "paragraph"; content: string };

export default function ArticleEditorPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const articleId = params.get("id");

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
  }, [status, router]);

  useEffect(() => {
    const load = async () => {
      if (!articleId) return;
      setLoading(true);
      const res = await fetch(`/api/articles/${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.article.title ?? "");
        setProjectId(data.article.projectId ? String(data.article.projectId) : "");
        setBlocks(data.blocks ?? []);
      }
      setLoading(false);
    };
    load();
  }, [articleId]);

  const createDraft = async () => {
    setLoading(true);
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title || "Untitled" }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.replace(`/admin/article/editor?id=${data.id}`);
    }
  };

  const save = async (publish = false) => {
    if (!articleId) return;
    setLoading(true);
    await fetch(`/api/articles/${articleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        projectId: projectId ? Number(projectId) : null,
        status: publish ? "published" : undefined,
        blocks: blocks.map((b, i) => ({ type: b.type, content: b.content, position: i })),
      }),
    });
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Article Editor</h1>
        <Button variant="outline" onClick={() => router.push("/admin/article")}>Back to list</Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Project ID (optional)</label>
        <Input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="e.g. 1" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Blocks</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setBlocks((b) => [...b, { type: "header", content: "" }])}>+ Header</Button>
            <Button variant="outline" onClick={() => setBlocks((b) => [...b, { type: "paragraph", content: "" }])}>+ Paragraph</Button>
          </div>
        </div>
        <div className="space-y-4">
          {blocks.map((b, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-xs text-muted-foreground">{b.type.toUpperCase()}</div>
              <Input value={b.content} onChange={(e) => setBlocks((arr) => arr.map((x, i) => i === idx ? { ...x, content: e.target.value } : x))} placeholder={b.type === 'header' ? 'Header text' : 'Paragraph text'} />
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setBlocks((arr) => arr.filter((_, i) => i !== idx))}>Remove</Button>
                <Button variant="ghost" onClick={() => setBlocks((arr) => idx > 0 ? arr.toSpliced(idx - 1, 2, arr[idx], arr[idx - 1]) : arr)} disabled={idx === 0}>Up</Button>
                <Button variant="ghost" onClick={() => setBlocks((arr) => idx < arr.length - 1 ? arr.toSpliced(idx, 2, arr[idx + 1], arr[idx]) : arr)} disabled={idx === blocks.length - 1}>Down</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {!articleId ? (
          <Button onClick={createDraft} disabled={loading}>Create Draft</Button>
        ) : (
          <>
            <Button variant="outline" onClick={() => save(false)} disabled={loading}>Save</Button>
            <Button onClick={() => save(true)} disabled={loading}>Publish</Button>
          </>
        )}
      </div>
    </div>
  );
}


