-- CreateTable
CREATE TABLE "tate_collection_art_data" (
    "id" INTEGER NOT NULL,
    "accession_number" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "artist_role" TEXT NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "title" TEXT,
    "date_text" TEXT NOT NULL,
    "medium" TEXT,
    "credit_line" TEXT,
    "year" TEXT,
    "acquisition_year" TEXT,
    "dimensions" TEXT,
    "width" TEXT,
    "height" TEXT,
    "depth" TEXT,
    "units" TEXT,
    "inscription" TEXT,
    "thumbnail_copyright" TEXT,
    "thumbnail_url" TEXT,
    "url" TEXT,

    CONSTRAINT "tate_collection_art_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "artId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nonUserName" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comments_nonUserName_artId_key" ON "comments"("nonUserName", "artId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_artId_fkey" FOREIGN KEY ("artId") REFERENCES "tate_collection_art_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
