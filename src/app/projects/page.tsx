import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

type Project = {
  id: number;
  title: string;
  tldr: string;
  repoUrl: string | null;
  articleId: number | null;
};

async function getProjects(): Promise<Project[]> {
  const rows = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      tldr: schema.projects.tldr,
      repoUrl: schema.projects.repoUrl,
      articleId: schema.projects.articleId,
    })
    .from(schema.projects)
    .where(eq(schema.projects.published, true))
    .orderBy(desc(schema.projects.createdAt));
  return rows as Project[];
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => {
          const hasRepo = Boolean(project.repoUrl);
          return (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription>{project.tldr}</CardDescription>
              </CardHeader>
              <CardContent />
              <CardFooter className="gap-2">
                {hasRepo ? (
                  <a
                    href={project.repoUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">View Repo</Button>
                  </a>
                ) : (
                  <Button variant="outline" disabled>
                    Repo (coming soon)
                  </Button>
                )}
                {project.articleId ? (
                  <Link href={`/articles/${project.articleId}`}>
                    <Button>Read Article</Button>
                  </Link>
                ) : (
                  <Button disabled>Article (coming soon)</Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

