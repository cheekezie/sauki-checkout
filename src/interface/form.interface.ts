// Form Validation Interfaces
export interface FormData {
  [key: string]: any;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface UseFormValidationReturn {
  formData: FormData;
  errors: ValidationErrors;
  isValid: boolean;
  updateField: (field: string, value: any) => void;
  updateFieldWithValidation: (field: string, value: any, schema: any) => void;
  validateField: (field: string, schema: any) => boolean;
  validateForm: (schema: any) => boolean;
  clearErrors: () => void;
  resetForm: () => void;
}

// Registration/Form Request Interfaces
export interface RegisterSchoolRequest {
  [x: string]: string;
  schoolName: string;
  schoolType: 'primary' | 'secondary' | 'tertiary';
  schoolCategory: string;
  schoolBoard: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface VerificationRequest {
  email: string;
}
