-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "memberType" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "otherClub" TEXT,
    "paymentType" TEXT NOT NULL,
    "paymentCode" TEXT NOT NULL,
    "confirmationCode" TEXT NOT NULL,
    "paymentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "telephone" TEXT,
    "profession" TEXT,
    "residentialAddress" TEXT,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Registration_confirmationCode_idx" ON "Registration"("confirmationCode");

-- CreateIndex
CREATE INDEX "Registration_email_idx" ON "Registration"("email");

-- CreateIndex
CREATE INDEX "Registration_paymentConfirmed_idx" ON "Registration"("paymentConfirmed");
