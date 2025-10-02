/*
  Warnings:

  - Added the required column `mission` to the `about` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `about` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vision` to the `about` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_about" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "values" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_about" ("content", "id", "updatedAt", "title", "vision", "mission", "values", "createdAt") 
SELECT 
  "content", 
  "id", 
  "updatedAt",
  'Tentang PGRI Kabupaten OKU Timur' as "title",
  'Menjadi organisasi profesi guru yang terdepan dalam meningkatkan kualitas pendidikan dan kesejahteraan guru di Kabupaten OKU Timur.' as "vision",
  'Meningkatkan kompetensi dan profesionalisme guru, memperjuangkan kesejahteraan anggota, mengembangkan kualitas pendidikan di daerah, dan membangun kerjasama dengan berbagai pihak.' as "mission",
  'Profesionalisme, Integritas, Solidaritas, dan Inovasi' as "values",
  CURRENT_TIMESTAMP as "createdAt"
FROM "about";
DROP TABLE "about";
ALTER TABLE "new_about" RENAME TO "about";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
