/*
  Warnings:

  - You are about to drop the column `profileImage` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "profileImage",
ADD COLUMN     "creationDate" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "file" VARCHAR(100),
ALTER COLUMN "content" DROP NOT NULL;
