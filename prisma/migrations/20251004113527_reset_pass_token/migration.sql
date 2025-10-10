-- CreateTable
CREATE TABLE "public"."ResetToken" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_identifier_key" ON "public"."ResetToken"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_token_key" ON "public"."ResetToken"("token");
