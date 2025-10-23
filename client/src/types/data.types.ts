export interface Student {
  id: number;
  rfidTag: string;
  name: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  guardianName: string;
  departmentId: number;
  department: string;
  year: number;
  photo: string;
}

export interface AddStudentData {
  rfidTag: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  birthDate: string;
  address: string;
  guardianName: string;
  departmentId: number;
  year: number;
  photo?: string;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  acronym: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  name: string;
  department: string;
  year: number;
  photo: string;
  type: string;
  timestamp: string;
  date: string;
}
