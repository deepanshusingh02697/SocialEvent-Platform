-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isArchive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "EventParticipant" ADD COLUMN     "isArchive" BOOLEAN NOT NULL DEFAULT false;
