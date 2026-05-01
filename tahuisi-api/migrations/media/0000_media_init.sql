CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`uploader_id` text NOT NULL,
	`media_type` text NOT NULL,
	`mime_type` text NOT NULL,
	`alt_text` text,
	`r2_key` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`metadata` text DEFAULT '{}',
	`is_public` integer DEFAULT true,
	`uploaded_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_r2_key_unique` ON `media` (`r2_key`);--> statement-breakpoint
CREATE INDEX `idx_media_uploader` ON `media` (`uploader_id`);--> statement-breakpoint
CREATE INDEX `idx_media_type` ON `media` (`media_type`);