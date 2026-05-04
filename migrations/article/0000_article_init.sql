CREATE TABLE `article_authors` (
	`article_id` text NOT NULL,
	`author_id` text NOT NULL,
	PRIMARY KEY(`article_id`, `author_id`),
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`article_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `author_id_idx` ON `article_authors` (`author_id`);--> statement-breakpoint
CREATE TABLE `articles` (
	`article_id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`thumbnail_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`published_at` integer,
	`updated_at` integer,
	`is_live` integer DEFAULT false NOT NULL,
	CONSTRAINT "check_live_status" CHECK("articles"."is_live" = 0 OR ("articles"."is_live" = 1 AND "articles"."status" = 'published')),
	CONSTRAINT "check_publish_date" CHECK("articles"."published_at" IS NULL OR "articles"."created_at" <= "articles"."published_at"),
	CONSTRAINT "check_update_created" CHECK("articles"."updated_at" IS NULL OR "articles"."updated_at" >= "articles"."created_at"),
	CONSTRAINT "check_update_published" CHECK("articles"."updated_at" IS NULL OR "articles"."published_at" IS NULL OR "articles"."updated_at" >= "articles"."published_at")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE INDEX `status_date_idx` ON `articles` (`status`,`published_at`);