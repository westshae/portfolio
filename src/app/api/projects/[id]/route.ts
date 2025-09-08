import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

// PATCH /api/projects/:id - update project
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });
  const body = await req.json().catch(() => ({}));

  const { title, tldr, repoUrl, articleId, published } = body ?? {};

  await db.update(schema.projects).set({
    ...(title !== undefined ? { title } : {}),
    ...(tldr !== undefined ? { tldr } : {}),
    ...(repoUrl !== undefined ? { repoUrl } : {}),
    ...(articleId !== undefined ? { articleId } : {}),
    ...(published !== undefined ? { published: Boolean(published) } : {}),
    updatedAt: new Date(),
  }).where(eq(schema.projects.id, id));

  return NextResponse.json({ ok: true });
}

// GET /api/projects/:id - fetch single project
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });
  const [row] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(row);
}


