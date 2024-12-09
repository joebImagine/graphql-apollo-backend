-- CreateTable
CREATE TABLE "Donations" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("id")
);
