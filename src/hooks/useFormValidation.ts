import { useState, useCallback } from "react";
import type { ObjectSchema } from "joi";

interface FormData {
  [key: string]: unknown;
}

interface ValidationErrors {
  [key: string]: string;
}

interface UseFormValidationReturn {
  formData: FormData;
  errors: ValidationErrors;
  isValid: boolean;
  updateField: (field: string, value: unknown) => void;
  updateFieldWithValidation: (field: string, value: unknown, schema: ObjectSchema) => void;
  validateField: (field: string, schema: ObjectSchema) => void;
  validateForm: (schema: ObjectSchema) => boolean;
  clearErrors: () => void;
  setFormData: (data: FormData) => void;
}

export const useFormValidation = (initialData: FormData = {}): UseFormValidationReturn => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateField = useCallback((field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
  }, []);

  const updateFieldWithValidation = useCallback((field: string, value: unknown, schema: ObjectSchema) => {
    // Update formData first
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Validate the updated formData with the full schema to support cross-field references
      const { error } = schema.validate(updated, { abortEarly: false });
      
      // Update errors based on the validation result
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        if (error) {
          // Update errors for all fields that have errors
          error.details.forEach((detail) => {
            const fieldPath = detail.path[0] as string;
            newErrors[fieldPath] = detail.message;
          });
          // Remove errors for fields that no longer have errors
          Object.keys(newErrors).forEach(key => {
            if (!error.details.some(detail => detail.path[0] === key)) {
              delete newErrors[key];
            }
          });
        } else {
          // Clear errors for this field if validation passes
          delete newErrors[field];
        }
        return newErrors;
      });
      
      return updated;
    });
  }, []);

  const validateField = useCallback((field: string, schema: ObjectSchema) => {
    const fieldSchema = schema.extract(field);
    const { error } = fieldSchema.validate(formData[field]);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error.details[0].message;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
    
    return !error;
  }, [formData]);

  const validateForm = useCallback((schema: ObjectSchema): boolean => {
    const { error } = schema.validate(formData, { abortEarly: false });
    
    if (error) {
      const newErrors: ValidationErrors = {};
      error.details.forEach((detail) => {
        const field = detail.path[0] as string;
        newErrors[field] = detail.message;
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [formData]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const isValid = Object.keys(errors).length === 0 && 
    Object.values(formData).every(value => 
      value !== undefined && value !== null && value !== ''
    );

  return {
    formData,
    errors,
    isValid,
    updateField,
    updateFieldWithValidation,
    validateField,
    validateForm,
    clearErrors,
    setFormData,
  };
};
