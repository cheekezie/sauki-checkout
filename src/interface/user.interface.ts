import type { MerchantI } from './organization.interface';

/**
 * User Interface
 * Represents the authenticated user/admin object from JWT token or API response
 */
export interface User {
  _id?: string;
  id?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  profileImage?: string;
  gender?: 'male' | 'female' | 'Male' | 'Female';
  phoneVerified?: boolean;
  disabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  role?: string;
  roles?: string[];
  permissions?: string[] | Record<string, { read?: boolean; write?: boolean }>;
  organizations?: MerchantI[];
  organization?: MerchantI | string;
  currentOrgVariant?: string;
  groupManagedFees?: boolean;
  [key: string]: any;
}

// User Types
export interface UserType {
  id: "school" | "other";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface UserTypeCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isSelected: boolean;
  onClick: () => void;
}

// Parent Interface
export interface Parent {
  id: string;
  sn: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  occupation: string;
  relationship: "Father" | "Mother" | "Guardian";
  wardsCount: number;
  wards: Ward[];
  registrationDate: string;
  lastActive: string;
  status: "active" | "inactive";
}

export interface Ward {
  id: string;
  firstName: string;
  lastName: string;
  class: string;
  studentId: string;
  relationship: "Son" | "Daughter" | "Ward";
}

export interface ParentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parent: Parent | null;
  onSave?: (parentData: Partial<Parent>) => void;
  onDelete?: (parentId: string) => void;
  editMode?: boolean;
}
