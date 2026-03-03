CREATE TABLE `stack_likes` (
	`stack_id` text NOT NULL,
	`device_id` text NOT NULL,
	FOREIGN KEY (`stack_id`) REFERENCES `stacks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `stack_saves` (
	`stack_id` text NOT NULL,
	`device_id` text NOT NULL,
	FOREIGN KEY (`stack_id`) REFERENCES `stacks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `stacks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`config` text NOT NULL,
	`device_id` text NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`is_preset` integer DEFAULT false NOT NULL,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`saves_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
