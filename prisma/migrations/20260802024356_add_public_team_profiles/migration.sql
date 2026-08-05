-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "bookingHref" TEXT DEFAULT '/#contact',
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "publicProfile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qualifications" TEXT,
ADD COLUMN     "showOnHome" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "specialities" TEXT;

-- CreateIndex
CREATE INDEX "Staff_publicProfile_showOnHome_sortOrder_idx" ON "Staff"("publicProfile", "showOnHome", "sortOrder");
