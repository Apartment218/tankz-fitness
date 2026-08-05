-- CreateEnum
CREATE TYPE "HeroBackgroundType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "HomepageHero" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "title" TEXT NOT NULL,
    "highlightedWord" TEXT,
    "subtitle" TEXT,
    "primaryButtonText" TEXT NOT NULL DEFAULT 'Start Today',
    "primaryButtonLink" TEXT NOT NULL DEFAULT '/#contact',
    "secondaryButtonText" TEXT,
    "secondaryButtonLink" TEXT,
    "backgroundType" "HeroBackgroundType" NOT NULL DEFAULT 'IMAGE',
    "backgroundImageUrl" TEXT,
    "backgroundVideoUrl" TEXT,
    "overlayOpacity" INTEGER NOT NULL DEFAULT 65,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroStat" (
    "id" TEXT NOT NULL,
    "heroId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HeroStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroBadge" (
    "id" TEXT NOT NULL,
    "heroId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HeroBadge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroStat_heroId_idx" ON "HeroStat"("heroId");

-- CreateIndex
CREATE INDEX "HeroBadge_heroId_idx" ON "HeroBadge"("heroId");

-- AddForeignKey
ALTER TABLE "HeroStat" ADD CONSTRAINT "HeroStat_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "HomepageHero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroBadge" ADD CONSTRAINT "HeroBadge_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "HomepageHero"("id") ON DELETE CASCADE ON UPDATE CASCADE;
