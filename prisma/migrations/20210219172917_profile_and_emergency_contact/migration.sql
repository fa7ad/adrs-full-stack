/*
  Warnings:

  - Added the required column `dob` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nid_number` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driving_license` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nid_number" TEXT NOT NULL,
ADD COLUMN     "driving_license" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profileId" INTEGER,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
