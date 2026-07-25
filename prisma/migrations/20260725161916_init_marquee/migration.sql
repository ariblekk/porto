-- CreateTable
CREATE TABLE "MarqueeItem" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MarqueeItem_pkey" PRIMARY KEY ("id")
);
