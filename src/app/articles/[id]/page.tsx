import { db, schema } from "@/lib/db";
import { asc, eq } from "drizzle-orm";

type Block = { id: number; type: 'header' | 'paragraph'; content: string };

async function getArticle(id: number) {
  const [article] = await db.select().from(schema.articles).where(eq(schema.articles.id, id));
  if (!article) return null;
  const blocks = await db
    .select()
    .from(schema.articleBlocks)
    .where(eq(schema.articleBlocks.articleId, id))
    .orderBy(asc(schema.articleBlocks.position));
  return { article, blocks };
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const idNum = Number(params.id);
  const data = Number.isFinite(idNum) ? await getArticle(idNum) : null;
  if (!data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <p className="text-muted-foreground">Article not found.</p>
      </div>
    );
  }

  const { article, blocks } = data as { article: { title: string }, blocks: Block[] };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{article.title}</h1>
      <div className="space-y-4">
        {blocks.map((b) => (
          b.type === 'header' ? (
            <h2 key={b.id} className="text-xl font-semibold">{b.content}</h2>
          ) : (
            <p key={b.id} className="leading-7 text-foreground/90">{b.content}</p>
          )
        ))}
      </div>
    </div>
  );
}


