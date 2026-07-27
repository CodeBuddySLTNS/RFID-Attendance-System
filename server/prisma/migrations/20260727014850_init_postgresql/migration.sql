-- CreateTable
CREATE TABLE "faculties" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "faculties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "facultyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "departmentId" SERIAL NOT NULL,
    "acronym" VARCHAR(15) NOT NULL,
    "departmentName" VARCHAR(255) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("departmentId")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "rfidTag" VARCHAR(50),
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "middleInitial" VARCHAR(1),
    "birthDate" DATE,
    "address" VARCHAR(255),
    "guardianName" VARCHAR(100),
    "guardianPhone" VARCHAR(20),
    "departmentId" INTEGER,
    "year" SMALLINT NOT NULL,
    "photo" VARCHAR(255),
    "facultyId" INTEGER,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "type" VARCHAR(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "faculties_username_key" ON "faculties"("username");

-- CreateIndex
CREATE UNIQUE INDEX "students_rfidTag_key" ON "students"("rfidTag");

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("departmentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
