-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "memberType" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "paymentCode" TEXT NOT NULL,
    "confirmationCode" TEXT NOT NULL,
    "paymentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Registration_confirmationCode_idx" ON "Registration"("confirmationCode");

-- CreateIndex
CREATE INDEX "Registration_email_idx" ON "Registration"("email");

-- CreateIndex
CREATE INDEX "Registration_paymentConfirmed_idx" ON "Registration"("paymentConfirmed");
