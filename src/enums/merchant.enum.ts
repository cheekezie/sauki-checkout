export type kycDocumentStatusTypes = 'pending' | 'deny' | 'approved' | 'notUploaded';

export type BvnStatusTypes = 'approved' | 'pending' | 'rejected';

export type ActivationTypes = 'paid' | 'waived' | 'pending';

export type OrganizationCategory = 'school' | 'other';

export type SchoolType = 'primary' | 'secondary' | 'tertiary';

export type SchoolCategoryBoard = 
  | 'privateSchool' 
  | 'methodistSchool' 
  | 'anglicanSchool' 
  | 'catholicSchool' 
  | 'publicPrimarySchool' 
  | 'publicSecondarySchool' 
  | 'publicTechnicalSchool' 
  | 'unitySchool' 
  | 'nonCategory' 
  | 'adultEducation' 
  | 'university' 
  | 'polytechnic' 
  | 'islamic' 
  | 'coe';

export const MerchantRoles = {
  // Backend roles (required for API)
  PORTAL_ADMIN: 'portalAdmin',
  ORG_ADMIN: 'orgAdmin',
  GROUP_ADMIN: 'groupAdmin',
  BASIC_STAFF: 'basicStaff',
    
  // Legacy roles (for backward compatibility)
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ACCOUNTANT: 'ACCOUNTANT',
  MERCHANT: 'MERCHANT',
  TEACHER: 'TEACHER',
} as const;

export type MerchantRoleEnum = typeof MerchantRoles[keyof typeof MerchantRoles];