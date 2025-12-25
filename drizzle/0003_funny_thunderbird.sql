CREATE TABLE `performanceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nodeAddress` varchar(255) NOT NULL,
	`snapshot` text NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `performanceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nodeAddress` varchar(255) NOT NULL,
	`nodePubkey` text,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `watchlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `watchlist_nodeAddress_unique` UNIQUE(`nodeAddress`)
);
