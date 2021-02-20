/*
  Warnings:

  - You are about to drop the column `profileId` on the `emergency_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `profile` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[user_id]` on the table `profile`. If there are existing duplicate values, the migration will fail.
  - Added the required column `user_id` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "emergency_contacts" DROP CONSTRAINT "emergency_contacts_profileId_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_userId_fkey";

-- DropIndex
DROP INDEX "profile_userId_unique";

-- AlterTable
ALTER TABLE "emergency_contacts" DROP COLUMN "profileId",
ADD COLUMN     "profile_id" INTEGER;

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_unique" ON "profile"("user_id");

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
