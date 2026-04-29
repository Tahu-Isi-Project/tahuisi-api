CREATE TABLE `sessions` (
	`session_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`user_agent` text NOT NULL,
	`ip_address` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
	`bio` text,
	CONSTRAINT "last_login_check" CHECK("users"."last_login" >= "users"."register_date")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_real_username_unique` ON `users` (`real_username`);