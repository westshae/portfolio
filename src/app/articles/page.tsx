import Link from "next/link";
import { db, schema } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

type ArticleListItem = {
  id: number;
  title: string;
  projectId: number | null;
};

async function getArticles(): Promise<ArticleListItem[]> {
  const rows = await db
    .select({ id: schema.articles.id, title: schema.articles.title, projectId: schema.articles.projectId })
    .from(schema.articles)
    .where(eq(schema.articles.status, "published"))
    .orderBy(desc(schema.articles.createdAt));
  return rows as ArticleListItem[];
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Articles</h1>
      {articles.length === 0 ? (
        <p className="text-muted-foreground">No published articles yet.</p>
      ) : (
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.id}>
              <Link href={`/articles/${a.id}`} className="text-primary hover:underline">
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

