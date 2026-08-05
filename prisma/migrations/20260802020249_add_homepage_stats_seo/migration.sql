-- AlterTable
ALTER TABLE "HomepageContent" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "noIndex" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openGraphDescription" TEXT,
ADD COLUMN     "openGraphImageUrl" TEXT,
ADD COLUMN     "openGraphTitle" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "statFourLabel" TEXT DEFAULT 'Client experience',
ADD COLUMN     "statFourValue" TEXT DEFAULT '5★',
ADD COLUMN     "statOneLabel" TEXT DEFAULT 'Personal coaching',
ADD COLUMN     "statOneValue" TEXT DEFAULT '1:1',
ADD COLUMN     "statThreeLabel" TEXT DEFAULT 'Accountability',
ADD COLUMN     "statThreeValue" TEXT DEFAULT '24/7',
ADD COLUMN     "statTwoLabel" TEXT DEFAULT 'Goal focused',
ADD COLUMN     "statTwoValue" TEXT DEFAULT '100%',
ADD COLUMN     "statsEyebrow" TEXT DEFAULT 'Built for measurable progress',
ADD COLUMN     "statsTitle" TEXT DEFAULT 'Coaching that turns effort into results',
ADD COLUMN     "statsVisible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "siteUrl" TEXT;
