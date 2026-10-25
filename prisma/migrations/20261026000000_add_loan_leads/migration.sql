CREATE TABLE "public"."loan_leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "loanAmount" INTEGER,
    "monthlyIncome" INTEGER,
    "source" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "loan_leads_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "loan_leads_createdAt_idx" ON "public"."loan_leads"("createdAt" DESC);
CREATE INDEX "loan_leads_status_idx" ON "public"."loan_leads"("status");
ALTER TABLE "public"."loan_leads" ENABLE ROW LEVEL SECURITY;
