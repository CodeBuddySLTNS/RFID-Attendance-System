/*
  Warnings:

  - You are about to drop the column `content` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `announcements` table. All the data in the column will be lost.
  - Added the required column `message` to the `announcements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `announcements` DROP COLUMN `content`,
    DROP COLUMN `title`,
    ADD COLUMN `message` TEXT NOT NULL;
