-- CreateEnum
CREATE TYPE "ClientGoal" AS ENUM ('WEIGHT_LOSS', 'MUSCLE_GAIN', 'GENERAL_FITNESS', 'STRENGTH', 'SPORTS_PERFORMANCE', 'MOBILITY', 'REHABILITATION', 'OTHER');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "bodyFatPercentage" DECIMAL(5,2),
ADD COLUMN     "coachNotes" TEXT,
ADD COLUMN     "consultationDate" TIMESTAMP(3),
ADD COLUMN     "currentWeightKg" DECIMAL(6,2),
ADD COLUMN     "goal" "ClientGoal",
ADD COLUMN     "goalDescription" TEXT,
ADD COLUMN     "heightCm" DECIMAL(6,2),
ADD COLUMN     "startingWeightKg" DECIMAL(6,2),
ADD COLUMN     "targetWeightKg" DECIMAL(6,2);

-- CreateIndex
CREATE INDEX "Member_goal_idx" ON "Member"("goal");
