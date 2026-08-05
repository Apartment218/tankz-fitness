-- AlterTable
ALTER TABLE "ClassSession" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FitnessClass" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "publicPage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showOnHome" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "MembershipPlan" ADD COLUMN     "buttonHref" TEXT DEFAULT '/#contact',
ADD COLUMN     "buttonText" TEXT DEFAULT 'Enquire now',
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "mostPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showOnHome" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "businessName" TEXT NOT NULL DEFAULT 'Tankz Fitness',
    "tagline" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "youtubeUrl" TEXT,
    "tiktokUrl" TEXT,
    "footerText" TEXT,
    "primaryCtaText" TEXT DEFAULT 'Start Today',
    "primaryCtaHref" TEXT DEFAULT '/#contact',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageContent" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "heroEyebrow" TEXT,
    "heroTitle" TEXT NOT NULL DEFAULT 'Train with purpose. Transform for life.',
    "heroSubtitle" TEXT,
    "heroPrimaryText" TEXT DEFAULT 'Start Today',
    "heroPrimaryHref" TEXT DEFAULT '/#contact',
    "heroSecondaryText" TEXT,
    "heroSecondaryHref" TEXT,
    "heroImageUrl" TEXT,
    "heroVisible" BOOLEAN NOT NULL DEFAULT true,
    "aboutEyebrow" TEXT,
    "aboutTitle" TEXT,
    "aboutBody" TEXT,
    "aboutImageUrl" TEXT,
    "aboutButtonText" TEXT,
    "aboutButtonHref" TEXT,
    "aboutVisible" BOOLEAN NOT NULL DEFAULT true,
    "servicesEyebrow" TEXT DEFAULT 'Personal training',
    "servicesTitle" TEXT DEFAULT 'Coaching built around your goals',
    "servicesBody" TEXT,
    "servicesVisible" BOOLEAN NOT NULL DEFAULT true,
    "followEyebrow" TEXT,
    "followTitle" TEXT,
    "followBody" TEXT,
    "followVisible" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsitePage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "navigationLabel" TEXT,
    "excerpt" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "showInHeader" BOOLEAN NOT NULL DEFAULT false,
    "showInFooter" BOOLEAN NOT NULL DEFAULT false,
    "headerOrder" INTEGER NOT NULL DEFAULT 0,
    "footerOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsitePage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsitePage_slug_key" ON "WebsitePage"("slug");

-- CreateIndex
CREATE INDEX "WebsitePage_published_idx" ON "WebsitePage"("published");

-- CreateIndex
CREATE INDEX "WebsitePage_showInHeader_headerOrder_idx" ON "WebsitePage"("showInHeader", "headerOrder");

-- CreateIndex
CREATE INDEX "WebsitePage_showInFooter_footerOrder_idx" ON "WebsitePage"("showInFooter", "footerOrder");

-- CreateIndex
CREATE INDEX "ClassSession_public_startsAt_idx" ON "ClassSession"("public", "startsAt");

-- CreateIndex
CREATE INDEX "FitnessClass_showOnHome_sortOrder_idx" ON "FitnessClass"("showOnHome", "sortOrder");

-- CreateIndex
CREATE INDEX "FitnessClass_publicPage_idx" ON "FitnessClass"("publicPage");

-- CreateIndex
CREATE INDEX "MembershipPlan_showOnHome_sortOrder_idx" ON "MembershipPlan"("showOnHome", "sortOrder");

-- CreateIndex
CREATE INDEX "MembershipPlan_featured_idx" ON "MembershipPlan"("featured");

-- CreateIndex
CREATE INDEX "MembershipPlan_mostPopular_idx" ON "MembershipPlan"("mostPopular");
