import { pgEnum, pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  googleId: text('google_id').unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Content enums
export const articleStatusEnum = pgEnum('article_status', ['draft', 'published']);
export const blockTypeEnum = pgEnum('block_type', ['header', 'paragraph']);

// Projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  tldr: text('tldr').notNull(),
  repoUrl: text('repo_url'),
  // Optional link to a primary article for this project
  articleId: integer('article_id'),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Articles
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  // Optional link back to a project
  projectId: integer('project_id'),
  status: articleStatusEnum('status').default('draft').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Article blocks (ordered content blocks)
export const articleBlocks = pgTable('article_blocks', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').notNull(),
  type: blockTypeEnum('type').notNull(),
  position: integer('position').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});
