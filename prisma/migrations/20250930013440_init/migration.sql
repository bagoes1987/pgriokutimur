-- CreateTable
CREATE TABLE "religions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "provinces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "regencies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,
    CONSTRAINT "regencies_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provinces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "districts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "regencyId" INTEGER NOT NULL,
    CONSTRAINT "districts_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "regencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "villages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "districtId" INTEGER NOT NULL,
    CONSTRAINT "villages_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "educations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "employee_statuses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "teaching_levels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "admins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "oldNpa" TEXT,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "religionId" INTEGER NOT NULL,
    "bloodType" TEXT,
    "address" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "photo" TEXT,
    "provinceId" INTEGER NOT NULL,
    "regencyId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "village" TEXT,
    "institutionName" TEXT NOT NULL,
    "workAddress" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,
    "educationId" INTEGER NOT NULL,
    "employeeStatusId" INTEGER NOT NULL,
    "rank" TEXT,
    "hasEducatorCert" BOOLEAN NOT NULL DEFAULT false,
    "subjects" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "members_religionId_fkey" FOREIGN KEY ("religionId") REFERENCES "religions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "members_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provinces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "members_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "regencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "members_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "members_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "members_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "educations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "members_employeeStatusId_fkey" FOREIGN KEY ("employeeStatusId") REFERENCES "employee_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "news" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "image" TEXT,
    "images" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "officers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "districtId" INTEGER,
    "photo" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "officers_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "about" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MemberTeachingLevels" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MemberTeachingLevels_A_fkey" FOREIGN KEY ("A") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MemberTeachingLevels_B_fkey" FOREIGN KEY ("B") REFERENCES "teaching_levels" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "religions_name_key" ON "religions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_name_key" ON "provinces"("name");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_name_key" ON "jobs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "educations_name_key" ON "educations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employee_statuses_name_key" ON "employee_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teaching_levels_name_key" ON "teaching_levels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_nik_key" ON "members"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_MemberTeachingLevels_AB_unique" ON "_MemberTeachingLevels"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberTeachingLevels_B_index" ON "_MemberTeachingLevels"("B");
