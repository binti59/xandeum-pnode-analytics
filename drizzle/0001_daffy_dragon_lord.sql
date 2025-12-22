CREATE TABLE `nodeBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nodeAddress` varchar(255) NOT NULL,
	`badgeType` enum('stable_champion','latest_version','geographic_pioneer','uptime_hero') NOT NULL,
	`badgeName` varchar(255) NOT NULL,
	`badgeDescription` text,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nodeBadges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rankingSnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nodeAddress` varchar(255) NOT NULL,
	`nodePubkey` text,
	`rank` int NOT NULL,
	`score` int NOT NULL,
	`version` varchar(64),
	`country` varchar(2),
	`city` varchar(255),
	`snapshotDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rankingSnapshots_id` PRIMARY KEY(`id`)
);
