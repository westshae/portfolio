"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Row = { id: number; title: string; status: string };

export default function AdminArticlePage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
  }, [status, router]);

  const load = async () => {
    const res = await fetch("/api/admin/articles");
    const data = res.ok ? await res.json() : [];
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Articles</h1>
        <Link href="/admin/article/editor">
          <Button>Add Article</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="flex items-center justify-between border rounded-md p-3">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-muted-foreground">{a.status}</div>
            </div>
            <Link href={`/admin/article/editor?id=${a.id}`}>
              <Button variant="outline">Edit</Button>
            </Link>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-muted-foreground">No articles yet.</div>
        )}
      </div>
    </div>
  );
}


