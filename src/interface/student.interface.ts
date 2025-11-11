/**
 * Student Interface Types
 * These types represent the student data structure from the API
 */

export interface Organization {
  _id: string;
  organizationName: string;
  serialNum?: string;
  kycDocumentStatus?: string;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
}

export interface Program {
  _id: string;
  name: string;
  code: string;
}

export interface AcademicHistoryItem {
  _id?: string;
  session: string;
  subClass?: string | null;
  program?: Program | null;
  department?: Department | null;
  studyYear?: number;
  academicClass?: { _id?: string; name?: string; code?: number } | string | null;
}

export interface StudentType {
  _id: string;
  fullName: string;
  regNumber: string;
  feeNgId?: string;
  gender: 'male' | 'female';
  class?: string | null | { _id?: string; name?: string; code?: string; subClass?: any };
  organization?: Organization;
  department?: Department | null;
  program?: Program | null;
  subClass?: string | null | { _id?: string; name?: string; code?: string };
  sessionAdmitted?: string;
  semesterAdmitted?: number;
  termAdmitted?: string;
  studyYear?: number;
  admissionYear?: string;
  studyType?: string;
  academicLevel?: string;
  removed?: boolean;
  graduated?: boolean;
  accountNumbersAssigned?: string[];
  academicHistory?: AcademicHistoryItem[];
  parent?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Legacy fields for backward compatibility
  name?: string;
  matricNo?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  schoolName?: string;
  addedOn?: string;
  sessionAdded?: string;
  status?: 'active' | 'graduated' | 'archive' | 'inactive';
}

/**
 * Student creation payload (omits _id and auto-generated fields)
 */
export interface StudentCreateType {
  name: string;
  matricNo?: string;
  regNumber?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  department?: string;
  level?: string;
  class: string;
  session?: string;
  semester?: string;
  gender: 'Male' | 'Female';
  status?: 'active' | 'graduated' | 'archive' | 'inactive';
}

/**
 * Student update payload (all fields optional except for identification)
 */
export interface StudentUpdateType extends Partial<StudentCreateType> {
  _id: string;
}

/**
 * API Response wrapper for student list (paginated)
 */
export interface StudentListResponse {
  status: string;
  data: {
    page: number;
    pages: number;
    studentCount: number;
    students: StudentType[];
  };
}

/**
 * Alternative API Response wrapper for student list (non-paginated)
 */
export interface StudentListResponseAlt {
  data: StudentType[];
  status: boolean;
  message?: string;
}

/**
 * API Response wrapper for single student
 */
export interface StudentResponse {
  data: StudentType;
  status: boolean;
  message?: string;
}

/**
 * Component-friendly student data structure
 * Maps API response to component needs
 */
export interface StudentData {
  id: string;
  sn: number;
  name: string;
  regNumber: string;
  gender: 'Male' | 'Female';
  class: string;
  schoolName?: string;
  addedOn?: string;
  sessionAdded?: string;
  department?: string;
  program?: string;
  academicHistory?: {
    class: string;
    session: string;
  };
}

