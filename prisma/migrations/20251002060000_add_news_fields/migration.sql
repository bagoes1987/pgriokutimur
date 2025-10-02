/*
  Warnings:

  - Added the required column `slug` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "news_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_news" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "image" TEXT,
    "images" TEXT,
    "categoryId" INTEGER,
    "authorId" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "news_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "news_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_news" ("content", "createdAt", "excerpt", "id", "image", "images", "isPublished", "title", "updatedAt") SELECT "content", "createdAt", "excerpt", "id", "image", "images", "isPublished", "title", "updatedAt" FROM "news";
DROP TABLE "news";
ALTER TABLE "new_news" RENAME TO "news";
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "news_categories_slug_key" ON "news_categories"("slug");
