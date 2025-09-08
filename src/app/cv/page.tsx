import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";
 

const items = [
  { title: "Self-taught over 8 years with dozens of projects" },
  { title: "Computer Science Degree from Victoria University of Wellington" },
  { title: "18 months over 2 companies (NZDF, SportyNZ)" },
  { title: "Fullstack Webdev, mainly TS, NextJS, ReactJS, NodeJS" },
  { title: "Java, C# .NET, Python, C++, AngularJS occasionally" },
  { title: "Absolute nerd for Products, Startups & Entrepreneurship" },
];

export default function CVPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">My TLDR</h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">Snapshot of who I am and what I do</p>
        <div className="mt-2">
          <Link
            href="https://forms.gle/2iMEK5WovtyDKWSS9"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open contact form in a new tab"
            className="inline-flex items-center gap-2 text-xs md:text-sm text-primary hover:underline"
          >
            <span aria-hidden><Mail className="h-4 w-4" /></span>
            <span>Contact form</span>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-16 grid-cols-1 md:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.title}
            className="h-full border-0 shadow-none bg-muted/30 hover:bg-muted/50 transition-colors rounded-2xl"
          >
            <CardHeader className="text-center py-8">
              <CardTitle className="text-xl md:text-2xl max-w-[12rem] mx-auto leading-tight break-words tracking-tight">
                {item.title}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}


