/*
 INSERT INTO users(name, password, role, year)
      VALUES ('admin', '$2b$10$xqpfTeyhL92u5BeEGEGH3eU6cfpTtGnXZy5WPE2TcMuvCCrZFjW3a', 'admin', 1)
*/

export const sqlTableQueries = `
    CREATE TABLE departments (
        departmentId INT PRIMARY KEY AUTO_INCREMENT,
        acronym VARCHAR(15) NOT NULL,
        departmentName VARCHAR(255) NOT NULL
    );

    CREATE TABLE students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        rfidTag VARCHAR(50) UNIQUE,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        middleInitial VARCHAR(1),
        birthDate DATE,
        address VARCHAR(255),
        guardianName VARCHAR(100),
        departmentId INT,
        year TINYINT NOT NULL CHECK (year BETWEEN 1 AND 4),
        photo VARCHAR(255),
        FOREIGN KEY (departmentId) REFERENCES departments(departmentId) ON DELETE SET NULL
    );

    CREATE TABLE attendances (
        id INT PRIMARY KEY AUTO_INCREMENT,
        studentId INT NOT NULL,
        type ENUM('IN', 'OUT') NOT NULL,
        timestamp DATETIME NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
    ); 
`;

export const insertDepartments = `
    INSERT INTO departments (departmentName, acronym) VALUES 
        ("Bachelor of Science in Computer Science", "BSCS"),
        ("Bachelor of Science in Information Technology", "BSIT"),
        ("Bachelor of Science in Social Work", "BSSW"),
        ("Bachelor of Early Childhood Education", "BECED");
`;
