/*
  Warnings:

  - You are about to drop the column `profileId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `EmergencyContact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmergencyContact" DROP CONSTRAINT "EmergencyContact_profileId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profileId";

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profileId" INTEGER,

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "EmergencyContact";

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
