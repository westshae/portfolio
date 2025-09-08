import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";

// GET /api/admin/projects - list all projects
export async function GET() {
  const rows = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      tldr: schema.projects.tldr,
      repoUrl: schema.projects.repoUrl,
      articleId: schema.projects.articleId,
      published: schema.projects.published,
      createdAt: schema.projects.createdAt,
    })
    .from(schema.projects)
    .orderBy(desc(schema.projects.createdAt));
  return NextResponse.json(rows);
}


