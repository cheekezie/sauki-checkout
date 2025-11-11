/**
 * Class Interface Types
 * These types represent the class data structure from the API
 */

export interface ClassType {
  _id: string;
  name: string;
  code: number;
  type?: 'primary' | 'secondary' | 'tertiary';
  organization?: string;
  subClass?: SubClassType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SubClassType {
  _id: string;
  name: string;
  capacity: number;
  isActive: boolean;
  assignedToClasses: boolean;
  organization?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API Response wrapper for class list
 */
export interface ClassListResponse {
  status: string;
  data: {
    classCount: number;
    classes: ClassType[];
  };
}

/**
 * API Response wrapper for single class
 */
export interface ClassResponse {
  status: string;
  data: ClassType;
  message?: string;
}

/**
 * API Response wrapper for subclass list
 */
export interface SubClassListResponse {
  status: string;
  data: {
    count: number;
    subClasses: SubClassType[];
  };
}

/**
 * API Response wrapper for single subclass
 */
export interface SubClassResponse {
  status: string;
  data: SubClassType;
  message?: string;
}

/**
 * Create subclass request
 */
export interface CreateSubClassRequest {
  name: string;
  capacity: number;
}

/**
 * Update subclass request
 */
export interface UpdateSubClassRequest {
  name?: string;
  capacity?: number;
  isActive?: boolean;
}

/**
 * Update class request
 */
export interface UpdateClassRequest {
  name: string;
}

/**
 * Assign subclass request
 */
export interface AssignSubClassRequest {
  classIds: string[];
  subClassId: string;
}

/**
 * Unassign subclass request
 */
export interface UnassignSubClassRequest {
  classId: string;
  subClassId: string;
}

/**
 * Assign subclass response
 */
export interface AssignSubClassResponse {
  status: string;
  message: string;
  data: {
    subClass: {
      id: string;
      name: string;
    };
    assigned: Array<{
      id: string;
      name: string;
    }>;
    alreadyAssigned: Array<{
      id: string;
      name: string;
    }>;
    summary: {
      totalAttempted: number;
      successfullyAssigned: number;
      alreadyAssigned: number;
    };
  };
}

