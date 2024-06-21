CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`productName` text,
	`variantId` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` text NOT NULL,
	`isUsageBased` integer DEFAULT false,
	`interval` text,
	`intervalCount` integer,
	`trialInterval` text,
	`trialIntervalCount` integer,
	`sort` integer
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lemonSqueezyId` text NOT NULL,
	`orderId` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`status` text NOT NULL,
	`statusFormatted` text NOT NULL,
	`renewsAt` text,
	`endsAt` text,
	`trialEndsAt` text,
	`price` text NOT NULL,
	`isUsageBased` integer DEFAULT false,
	`isPaused` integer DEFAULT false,
	`subscriptionItemId` integer NOT NULL,
	`userId` text NOT NULL,
	`planId` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`planId`) REFERENCES `plan`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE TABLE `webhookEvent` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL,
	`eventName` text NOT NULL,
	`processed` integer DEFAULT false,
	`body` text NOT NULL,
	`processingError` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plan_variantId_unique` ON `plan` (`variantId`);--> statement-breakpoint
CREATE UNIQUE INDEX `subscription_lemonSqueezyId_unique` ON `subscription` (`lemonSqueezyId`);