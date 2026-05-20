CREATE TABLE `sessions` (
	`session_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`user_agent` text NOT NULL,
	`ip_address` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_expires_at_idx` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_session_constraint` ON `sessions` (`user_id`,`user_agent`,`ip_address`);--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`real_username` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`display_name` text NOT NULL,
	`gender` text NOT NULL,
	`avatar_id` text,
	`register_date` integer NOT NULL,
	`last_login` integer NOT NULL,
	`user_status` text DEFAULT 'active' NOT NULL,
	`banned_date` integer,
	`banned_reason` text,
	`bio` text,
	CONSTRAINT "last_login_check" CHECK("users"."last_login" >= "users"."register_date"),
	CONSTRAINT "ban_consistency_check" CHECK(("users"."user_status" = 'banned' AND "users"."banned_date" IS NOT NULL) 
      OR 
      ("users"."user_status" <> 'banned' AND "users"."banned_date" IS NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_real_username_unique` ON `users` (`real_username`);