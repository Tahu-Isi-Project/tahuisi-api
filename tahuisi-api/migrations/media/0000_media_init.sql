CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`uploader_id` text NOT NULL,
	`media_type` text NOT NULL,
	`mime_type` text NOT NULL,
	`key` text NOT NULL,
	`bucket_name` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`file_hash` text NOT NULL,
	`width` integer,
	`height` integer,
	`thumbhash` text,
	`extra_metadata` text DEFAULT '{}',
	`alt_text` text,
	`is_public` integer DEFAULT true,
	`uploaded_at` integer,
	`updated_at` integer,
	CONSTRAINT "check_update_date" CHECK("media"."updated_at" >= "media"."uploaded_at")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_key_unique` ON `media` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `media_file_hash_unique` ON `media` (`file_hash`);--> statement-breakpoint
CREATE INDEX `idx_media_uploader` ON `media` (`uploader_id`);--> statement-breakpoint
CREATE INDEX `idx_media_type_dims` ON `media` (`media_type`,`width`,`height`);