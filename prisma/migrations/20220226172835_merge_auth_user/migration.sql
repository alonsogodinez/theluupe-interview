/*
  Warnings:

  - You are about to drop the `AuthUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "AuthUser_username_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AuthUser";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT,
    "lastName" TEXT
);
INSERT INTO "new_User" ("email", "firstName", "id", "lastName") SELECT "email", "firstName", "id", "lastName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
