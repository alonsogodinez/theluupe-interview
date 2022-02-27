/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "AuthUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT
);
INSERT INTO "new_User" ("email", "firstName", "id", "lastName") SELECT "email", "firstName", "id", "lastName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_username_key" ON "AuthUser"("username");
