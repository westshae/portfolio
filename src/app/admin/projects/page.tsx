"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Project = { id: number; title: string; tldr: string; repoUrl: string | null; articleId: number | null; published: boolean };

export default function AdminProjectsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
  }, [status, router]);

  const load = async () => {
    const res = await fetch("/api/projects");
    const data = res.ok ? await res.json() : [];
    // Admin view: also show unpublished by fetching individually is omitted for brevity
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublish = async (id: number, published: boolean) => {
    setLoading(true);
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    setLoading(false);
    await load();
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Projects</h1>
        <Link href="/admin/projects/editor">
          <Button>Add Project</Button>
        </Link>
      </div>

      <div className="pt-6 space-y-3">
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between border rounded-md p-3">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-muted-foreground">{p.tldr}</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/projects/editor?id=${p.id}`}>
                <Button variant="outline" disabled={loading}>Edit</Button>
              </Link>
              <Button variant="outline" onClick={() => togglePublish(p.id, !p.published)} disabled={loading}>
                {p.published ? "Unpublish" : "Publish"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


