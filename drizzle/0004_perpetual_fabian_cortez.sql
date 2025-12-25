ALTER TABLE `nodeStats` DROP INDEX `nodeStats_nodeAddress_unique`;--> statement-breakpoint
ALTER TABLE `nodeStats` MODIFY COLUMN `nodePubkey` varchar(255);--> statement-breakpoint
ALTER TABLE `nodeStats` ADD CONSTRAINT `nodeStats_nodePubkey_unique` UNIQUE(`nodePubkey`);