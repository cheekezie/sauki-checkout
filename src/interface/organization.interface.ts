import type { ActivationTypes, BvnStatusTypes, kycDocumentStatusTypes } from '@/enums/merchant.enum';

export interface SubAccount {
  _id: string;
  organizationName: string;
  serialNum?: string;
  organizationCategory?: 'school' | 'other';
  organizationType?: 'standalone' | 'group';
  kycDocument?: {
    logo?: string;
  };
  manageGroupFees?: boolean;
  group?: string;
  [key: string]: any;
}

export interface DefaultAdmin {
  _id?: string;
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  role?: string;
  organizations?: SubAccount[];
  [key: string]: any;
}

export interface OtherBankDetail {
  _id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  nipBankCode?: string;
  subAccountCode: string;
  defaultSplitPercentage?: number;
  settlementProfileCode?: string;
  [key: string]: any;
}

export interface MerchantI {
  _id: string;
  organizationName: string;
  email: string;
  phoneNumber: string;
  organizationCategory: 'school' | 'other';
  schoolType: 'secondary' | 'primary' | 'tertiary';
  schoolCategoryBoard: string;
  organizationType: 'standalone' | 'group';
  board: string | undefined;
  disabled: boolean;
  tinNumber: string;
  address: string;
  lga: string;
  state: string;
  bankAccountSet: boolean;
  monifyApiKey: string;
  directors: Directors[];
  createdAt: string;
  updatedAt: string;
  defaultAdmin: DefaultAdmin | object;
  kycDocument: BusinessDocuments;
  mySchoolPortalId: string;
  location: string;
  kycDocumentStatus: kycDocumentStatusTypes;
  activated: boolean;
  activationFee: number;
  activationFeeStatus: ActivationTypes;
  activationFeeRef: string;
  manageGroupFees: boolean;
  group: MerchantI;
  serialNum: string;
  merchantNumber: string;
  staticAccountName: string;
  bvnUpdated: boolean;
  partSettlement: boolean;
  bvnApproved: boolean;
  bvnApprovalStatus: BvnStatusTypes;
  bvn: string;
  bannerImage?: string; // Optional banner image at root level
  currentOrgVariant?: string; // Organization variant type
  groupManagedFees?: boolean; // Whether fees are group managed
  otherBankDetails?: OtherBankDetail[]; // Array of other bank details
}
export interface BusinessDocuments {
  cacForm2: string;
  cacForm7: string;
  utilityBill: string;
  businessReg: string;
  memorandum: string;
  identityCard: string;
  mandateLetter: string;
  logo: string;
  banner?: string; // Add banner field
}

export interface Directors {
  fullName: string;
  bvn: string;
  dob: string;
  _id: string;
}
