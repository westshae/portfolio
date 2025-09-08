import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

// GET /api/projects - list published projects
export async function GET() {
  const rows = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      tldr: schema.projects.tldr,
      repoUrl: schema.projects.repoUrl,
      articleId: schema.projects.articleId,
      createdAt: schema.projects.createdAt,
    })
    .from(schema.projects)
    .where(eq(schema.projects.published, true))
    .orderBy(desc(schema.projects.createdAt));

  return NextResponse.json(rows);
}

// POST /api/projects - create a new project (unpublished by default)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { title, tldr, repoUrl, articleId, published } = body ?? {};

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!tldr || typeof tldr !== "string") {
    return NextResponse.json({ error: "tldr is required" }, { status: 400 });
  }

  const [inserted] = await db
    .insert(schema.projects)
    .values({ title, tldr, repoUrl, articleId, published: Boolean(published) })
    .returning({ id: schema.projects.id });

  return NextResponse.json({ id: inserted.id }, { status: 201 });
}


