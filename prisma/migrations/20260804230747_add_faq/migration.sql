-- CreateTable
CREATE TABLE "FrequentlyAskedQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "showOnHome" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrequentlyAskedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FrequentlyAskedQuestion_active_showOnHome_sortOrder_idx" ON "FrequentlyAskedQuestion"("active", "showOnHome", "sortOrder");

-- CreateIndex
CREATE INDEX "FrequentlyAskedQuestion_featured_idx" ON "FrequentlyAskedQuestion"("featured");

-- CreateIndex
CREATE INDEX "FrequentlyAskedQuestion_category_idx" ON "FrequentlyAskedQuestion"("category");
