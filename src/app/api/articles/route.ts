import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

// GET /api/articles - list published articles
export async function GET() {
  const rows = await db
    .select({ id: schema.articles.id, title: schema.articles.title, projectId: schema.articles.projectId, createdAt: schema.articles.createdAt })
    .from(schema.articles)
    .where(eq(schema.articles.status, "published"))
    .orderBy(desc(schema.articles.createdAt));

  return NextResponse.json(rows);
}

// POST /api/articles - create a new draft article
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title: string | undefined = body?.title;
  const projectId: number | null = body?.projectId ?? null;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const [inserted] = await db
    .insert(schema.articles)
    .values({ title, projectId: projectId ?? undefined, status: "draft" })
    .returning({ id: schema.articles.id });

  return NextResponse.json({ id: inserted.id }, { status: 201 });
}


