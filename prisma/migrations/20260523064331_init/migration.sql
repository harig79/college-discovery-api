-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('IIT', 'NIT', 'IIIT', 'DEEMED', 'PRIVATE', 'GOVERNMENT', 'CENTRAL');

-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('BTECH', 'MTECH', 'MBA', 'MBBS', 'PHD', 'BCA', 'MCA', 'BSC', 'MSC', 'BARCH', 'OTHER');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'CAT', 'GATE', 'XAT', 'CLAT');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GENERAL', 'OBC', 'SC', 'ST', 'EWS');

-- CreateTable
CREATE TABLE "College" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "CollegeType" NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "established" INTEGER,
    "website" TEXT,
    "imageUrl" TEXT,
    "accreditation" TEXT,
    "totalRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "minFees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxFees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "degreeType" "DegreeType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "fees" DOUBLE PRECISION NOT NULL,
    "seats" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "avgPackage" DOUBLE PRECISION NOT NULL,
    "medianPackage" DOUBLE PRECISION NOT NULL,
    "highestPackage" DOUBLE PRECISION NOT NULL,
    "placementRate" DOUBLE PRECISION NOT NULL,
    "topRecruiters" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pros" TEXT,
    "cons" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamCutoff" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "courseId" INTEGER,
    "exam" "ExamType" NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'GENERAL',
    "openingRank" INTEGER NOT NULL,
    "closingRank" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "ExamCutoff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCollege" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedCollege_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE INDEX "College_type_idx" ON "College"("type");

-- CreateIndex
CREATE INDEX "College_state_idx" ON "College"("state");

-- CreateIndex
CREATE INDEX "College_totalRating_idx" ON "College"("totalRating");

-- CreateIndex
CREATE INDEX "College_minFees_idx" ON "College"("minFees");

-- CreateIndex
CREATE INDEX "Course_collegeId_idx" ON "Course"("collegeId");

-- CreateIndex
CREATE INDEX "Course_degreeType_idx" ON "Course"("degreeType");

-- CreateIndex
CREATE INDEX "Placement_collegeId_idx" ON "Placement"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "Placement_collegeId_year_key" ON "Placement"("collegeId", "year");

-- CreateIndex
CREATE INDEX "Review_collegeId_idx" ON "Review"("collegeId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "ExamCutoff_collegeId_idx" ON "ExamCutoff"("collegeId");

-- CreateIndex
CREATE INDEX "ExamCutoff_exam_category_closingRank_idx" ON "ExamCutoff"("exam", "category", "closingRank");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "SavedCollege_userId_idx" ON "SavedCollege"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCollege_userId_collegeId_key" ON "SavedCollege"("userId", "collegeId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamCutoff" ADD CONSTRAINT "ExamCutoff_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamCutoff" ADD CONSTRAINT "ExamCutoff_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
