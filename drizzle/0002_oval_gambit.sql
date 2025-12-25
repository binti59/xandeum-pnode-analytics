CREATE TABLE `nodeStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nodeAddress` varchar(255) NOT NULL,
	`nodePubkey` text,
	`stats` text NOT NULL,
	`accessible` int NOT NULL DEFAULT 0,
	`lastScanned` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nodeStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `nodeStats_nodeAddress_unique` UNIQUE(`nodeAddress`)
);
