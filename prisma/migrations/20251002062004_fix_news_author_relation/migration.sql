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
    CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "admins" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_news" ("authorId", "categoryId", "content", "createdAt", "excerpt", "id", "image", "images", "isPublished", "slug", "title", "updatedAt") SELECT "authorId", "categoryId", "content", "createdAt", "excerpt", "id", "image", "images", "isPublished", "slug", "title", "updatedAt" FROM "news";
DROP TABLE "news";
ALTER TABLE "new_news" RENAME TO "news";
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
