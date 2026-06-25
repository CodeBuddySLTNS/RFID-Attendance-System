-- CreateTable
CREATE TABLE `attendances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `type` VARCHAR(3) NOT NULL,
    `timestamp` DATETIME(0) NOT NULL,
    `date` DATE NOT NULL,

    INDEX `attendances_studentId_fkey`(`studentId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `departmentId` INTEGER NOT NULL AUTO_INCREMENT,
    `acronym` VARCHAR(15) NOT NULL,
    `departmentName` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`departmentId` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faculties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `faculties_username_key`(`username` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rfidTag` VARCHAR(50) NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `middleInitial` VARCHAR(1) NULL,
    `birthDate` DATE NULL,
    `address` VARCHAR(255) NULL,
    `guardianName` VARCHAR(100) NULL,
    `departmentId` INTEGER NULL,
    `year` TINYINT NOT NULL,
    `photo` VARCHAR(255) NULL,
    `facultyId` INTEGER NULL,

    INDEX `students_departmentId_fkey`(`departmentId` ASC),
    INDEX `students_facultyId_fkey`(`facultyId` ASC),
    UNIQUE INDEX `students_rfidTag_key`(`rfidTag` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`departmentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

