import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { asc, eq } from "drizzle-orm";

type BlockInput = {
  type: 'header' | 'paragraph';
  content: string;
  position?: number;
};

// GET /api/articles/:id - fetch article with ordered blocks
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const [article] = await db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.id, id));
  if (!article) return NextResponse.json({ error: "not found" }, { status: 404 });

  const blocks = await db
    .select()
    .from(schema.articleBlocks)
    .where(eq(schema.articleBlocks.articleId, id))
    .orderBy(asc(schema.articleBlocks.position));

  return NextResponse.json({ article, blocks });
}

// PATCH /api/articles/:id - update article fields, blocks, and publish
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "invalid id" }, { status: 400 });
  const body = await req.json().catch(() => ({}));

  const { title, projectId, status, blocks } = body ?? {};

  if (title !== undefined || projectId !== undefined || status !== undefined) {
    await db.update(schema.articles).set({
      ...(title !== undefined ? { title } : {}),
      ...(projectId !== undefined ? { projectId } : {}),
      ...(status !== undefined ? { status } : {}),
      updatedAt: new Date(),
    }).where(eq(schema.articles.id, id));
  }

  if (Array.isArray(blocks)) {
    // naive replace strategy: delete and reinsert ordered blocks
    await db.delete(schema.articleBlocks).where(eq(schema.articleBlocks.articleId, id));
    if (blocks.length > 0) {
      await db.insert(schema.articleBlocks).values(
        (blocks as BlockInput[]).map((b: BlockInput, index: number) => ({
          articleId: id,
          type: b.type,
          content: b.content,
          position: b.position ?? index,
        }))
      );
    }
  }

  return NextResponse.json({ ok: true });
}


