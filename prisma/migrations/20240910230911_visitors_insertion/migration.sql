-- CreateTable
CREATE TABLE "Visitors" (
    "id" TEXT NOT NULL,
    "visitor_id" TEXT,
    "has_visitor_type" TEXT,
    "page_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visitors" ADD CONSTRAINT "Visitors_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
