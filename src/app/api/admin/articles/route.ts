import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";

// GET /api/admin/articles - list all articles (any status)
export async function GET() {
  const rows = await db
    .select({ id: schema.articles.id, title: schema.articles.title, projectId: schema.articles.projectId, status: schema.articles.status, createdAt: schema.articles.createdAt })
    .from(schema.articles)
    .orderBy(desc(schema.articles.createdAt));
  return NextResponse.json(rows);
}


