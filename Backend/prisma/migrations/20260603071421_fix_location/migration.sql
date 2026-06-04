/*
  Warnings:

  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - Added the required column `Eventlocation` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "location",
ADD COLUMN     "Eventlocation" TEXT NOT NULL,
ALTER COLUMN "eventStartDate" SET DATA TYPE TEXT,
ALTER COLUMN "eventEndDate" SET DATA TYPE TEXT;
