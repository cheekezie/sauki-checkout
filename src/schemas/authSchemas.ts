import Joi from "joi";

// Nigerian phone number validation with better error messages
export const phoneSchema = Joi.string()
  .custom((value, helpers) => {
    if (!value) {
      return helpers.error('string.empty');
    }
    
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Check length and provide specific messages
    if (digits.length === 0) {
      return helpers.error('string.empty');
    }
    
    if (digits.length < 11) {
      return helpers.error('string.tooShort');
    }
    
    if (digits.length > 11) {
      return helpers.error('string.tooLong');
    }
    
    // Check if it starts with valid Nigerian prefix
    if (!digits.startsWith('0')) {
      return helpers.error('string.invalidPrefix');
    }
    
    // Check second digit (should be 7, 8, or 9)
    const secondDigit = digits[1];
    if (!['7', '8', '9'].includes(secondDigit)) {
      return helpers.error('string.invalidSecondDigit');
    }
    
    // Check third digit (should be 0 or 1 for valid Nigerian numbers)
    const thirdDigit = digits[2];
    if (!['0', '1'].includes(thirdDigit)) {
      return helpers.error('string.invalidThirdDigit');
    }
    
    return value;
  })
  .messages({
    'string.empty': 'Phone number is required',
    'string.tooShort': 'Phone number must be exactly 11 digits',
    'string.tooLong': 'Phone number must be exactly 11 digits',
    'string.invalidPrefix': 'Phone number must start with 0',
    'string.invalidSecondDigit': 'Invalid phone number format (second digit should be 7, 8, or 9)',
    'string.invalidThirdDigit': 'Invalid phone number format (third digit should be 0 or 1)',
    'any.required': 'Phone number is required'
  });

// Email validation
export const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .max(100)
  .messages({
    'string.email': 'Please enter a valid email address',
    'string.max': 'Email address must not exceed 100 characters',
    'string.empty': 'Email address is required',
    'any.required': 'Email address is required'
  });

// School name validation
const schoolNameSchema = Joi.string()
  .min(2)
  .max(100)
  .pattern(/^[a-zA-Z0-9\s\-'&.()]+$/)
  .messages({
    'string.min': 'School name must be at least 2 characters',
    'string.max': 'School name must not exceed 100 characters',
    'string.pattern.base': 'School name contains invalid characters',
    'string.empty': 'School name is required',
    'any.required': 'School name is required'
  });

// Category validation
const categorySchema = Joi.string()
  .min(1)
  .messages({
    'string.empty': 'Please select a category',
    'any.required': 'Please select a category'
  });

// Terms acceptance validation
const termsSchema = Joi.boolean()
  .valid(true)
  .messages({
    'any.only': 'You must accept the terms and conditions',
    'any.required': 'You must accept the terms and conditions'
  });

// School registration schema
export const schoolRegistrationSchema = Joi.object({
  schoolName: schoolNameSchema.required(),
  contactPhone: phoneSchema.required(),
  contactEmail: emailSchema.required(),
  category: categorySchema.required(),
  termsAccepted: termsSchema.required()
});

// Email or phone number validation (accepts both)
export const emailOrPhoneSchema = Joi.string()
  .custom((value, helpers) => {
    if (!value) {
      return helpers.error('string.empty');
    }
    
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return value;
    }
    
    // Check if it's a phone number
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) {
      return helpers.error('string.empty');
    }
    
    if (digits.length < 11) {
      return helpers.error('string.tooShort');
    }
    
    if (digits.length > 11) {
      return helpers.error('string.tooLong');
    }
    
    if (!digits.startsWith('0')) {
      return helpers.error('string.invalidPrefix');
    }
    
    const secondDigit = digits[1];
    if (!['7', '8', '9'].includes(secondDigit)) {
      return helpers.error('string.invalidSecondDigit');
    }
    
    const thirdDigit = digits[2];
    if (!['0', '1'].includes(thirdDigit)) {
      return helpers.error('string.invalidThirdDigit');
    }
    
    return value;
  })
  .messages({
    'string.empty': 'Email or phone number is required',
    'string.tooShort': 'Phone number must be exactly 11 digits',
    'string.tooLong': 'Phone number must be exactly 11 digits',
    'string.invalidPrefix': 'Phone number must start with 0',
    'string.invalidSecondDigit': 'Invalid phone number format (second digit should be 7, 8, or 9)',
    'string.invalidThirdDigit': 'Invalid phone number format (third digit should be 0 or 1)',
    'any.required': 'Email or phone number is required'
  });

// Login schema
export const loginSchema = Joi.object({
  phoneNumber: emailOrPhoneSchema.required(),
  password: Joi.string()
    .pattern(/^\d{6}$/)
    .messages({
      'string.pattern.base': 'PIN must contain only numbers (6 digits)',
      'string.empty': 'PIN is required',
      'any.required': 'PIN is required'
    })
    .required()
});

// Forgot password schema
export const forgotPasswordSchema = Joi.object({
  email: emailSchema.required()
});

// Phone verification schema (for sending OTP)
export const phoneOnlySchema = Joi.object({
  phone: phoneSchema.required()
});

// Phone verification schema (for verifying OTP)
export const phoneVerificationSchema = Joi.object({
  phone: phoneSchema.required(),
  otp: Joi.string()
    .pattern(/^\d{4,6}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 4-6 digit verification code',
      'string.empty': 'Verification code is required',
      'any.required': 'Verification code is required'
    })
    .required()
});

// PIN schema
export const pinSchema = Joi.string()
  .pattern(/^\d{6}$/)
  .messages({
    'string.pattern.base': 'PIN must contain only numbers (6 digits)',
    'string.empty': 'PIN is required',
    'any.required': 'PIN is required'
  })
  .required();

// Password schema
export const passwordSchema = Joi.string()
  .min(10)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .messages({
    'string.min': 'Password must be at least 10 characters',
    'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
  .required();

// Create password schema
export const createPasswordSchema = Joi.object({
  password: passwordSchema,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Please confirm your password',
      'any.required': 'Please confirm your password'
    })
    .required()
});

// Create PIN schema
export const createPinSchema = Joi.object({
  pin: pinSchema,
  confirmPin: Joi.string()
    .valid(Joi.ref('pin'))
    .messages({
      'any.only': 'PINs do not match',
      'string.empty': 'Please confirm your PIN',
      'any.required': 'Please confirm your PIN'
    })
    .required()
});

// Validation helper function
export const validateField = (schema: Joi.Schema, value: any) => {
  const { error } = schema.validate(value);
  return {
    isValid: !error,
    error: error?.details[0]?.message
  };
};

// PIN validation helper (for backward compatibility)
export const validatePIN = (pin: string) => {
  return validateField(pinSchema, pin);
};

// Phone validation helper (for backward compatibility)  
export const validatePhoneNumber = (phone: string) => {
  return validateField(phoneSchema, phone);
};

// OTP validation helper (for backward compatibility)
export const validateOTP = (otp: string) => {
  const otpSchema = Joi.string()
    .pattern(/^\d{4,6}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 4-6 digit verification code',
      'string.empty': 'Verification code is required',
      'any.required': 'Verification code is required'
    })
    .required();
  return validateField(otpSchema, otp);
};

// Parent validation schema
export const parentSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
      'string.empty': 'First name is required',
      'any.required': 'First name is required'
    })
    .required(),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      'string.empty': 'Last name is required',
      'any.required': 'Last name is required'
    })
    .required(),
  email: emailSchema.required(),
  phoneNumber: phoneSchema.required(),
  address: Joi.string()
    .min(5)
    .max(200)
    .messages({
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address must not exceed 200 characters',
      'string.empty': 'Address is required',
      'any.required': 'Address is required'
    })
    .optional(),
  occupation: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s\-'&.()]+$/)
    .messages({
      'string.min': 'Occupation must be at least 2 characters',
      'string.max': 'Occupation must not exceed 100 characters',
      'string.pattern.base': 'Occupation contains invalid characters',
      'string.empty': 'Occupation is required',
      'any.required': 'Occupation is required'
    })
    .optional(),
  relationship: Joi.string()
    .valid('Father', 'Mother', 'Guardian')
    .messages({
      'any.only': 'Please select a valid relationship',
      'string.empty': 'Relationship is required',
      'any.required': 'Relationship is required'
    })
    .required(),
  status: Joi.string()
    .valid('active', 'inactive')
    .messages({
      'any.only': 'Please select a valid status',
      'string.empty': 'Status is required',
      'any.required': 'Status is required'
    })
    .required()
});

// Admin validation schema
export const adminSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters',
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
      'string.empty': 'Name is required',
      'any.required': 'Name is required'
    })
    .required(),
  email: emailSchema.required(),
  phoneNumber: phoneSchema.required(),
  role: Joi.string()
    .valid('basicStaff', 'orgAdmin', 'portalAdmin', 'groupAdmin')
    .messages({
      'any.only': 'Role must be one of: basicStaff, orgAdmin, portalAdmin, groupAdmin',
      'string.empty': 'Role is required',
      'any.required': 'Role is required'
    })
    .required(),
  gender: Joi.string()
    .valid('Male', 'Female', '--')
    .messages({
      'any.only': 'Please select a valid gender',
      'string.empty': 'Gender is required',
      'any.required': 'Gender is required'
    })
    .required()
});

// Permission validation schema
export const permissionSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Permission title must be at least 2 characters',
      'string.max': 'Permission title must not exceed 100 characters',
      'string.empty': 'Permission title is required',
      'any.required': 'Permission title is required'
    })
    .required(),
  read: Joi.boolean().required(),
  write: Joi.boolean().required()
});

// Ward validation schema
export const wardSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
      'string.empty': 'First name is required',
      'any.required': 'First name is required'
    })
    .required(),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      'string.empty': 'Last name is required',
      'any.required': 'Last name is required'
    })
    .required(),
  class: Joi.string()
    .min(1)
    .max(20)
    .messages({
      'string.min': 'Class is required',
      'string.max': 'Class must not exceed 20 characters',
      'string.empty': 'Class is required',
      'any.required': 'Class is required'
    })
    .required(),
  studentId: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z0-9\-_]+$/)
    .messages({
      'string.min': 'Student ID must be at least 3 characters',
      'string.max': 'Student ID must not exceed 20 characters',
      'string.pattern.base': 'Student ID can only contain letters, numbers, hyphens, and underscores',
      'string.empty': 'Student ID is required',
      'any.required': 'Student ID is required'
    })
    .required(),
  relationship: Joi.string()
    .valid('Son', 'Daughter', 'Ward')
    .messages({
      'any.only': 'Please select a valid relationship',
      'string.empty': 'Relationship is required',
      'any.required': 'Relationship is required'
    })
    .required()
});

// Validation helper for objects
export const validateObject = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors: Record<string, string> = {};
    error.details.forEach((detail) => {
      const field = detail.path[0] as string;
      errors[field] = detail.message;
    });
    return { isValid: false, errors, data: null };
  }
  
  return { isValid: true, errors: {}, data: value };
};
