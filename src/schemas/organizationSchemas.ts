import Joi from "joi";
import { emailSchema } from "./authSchemas";

/**
 * Organization Registration Schema for Dashboard
 * Validates organization creation from the dashboard
 */
export const organizationRegistrationSchema = Joi.object({
  email: emailSchema.required(),
  organizationName: Joi.string()
    .min(3)
    .max(200)
    .pattern(/^[a-zA-Z0-9\s\-'&.()]+$/)
    .messages({
      'string.min': 'Organization name must be at least 3 characters',
      'string.max': 'Organization name must not exceed 200 characters',
      'string.pattern.base': 'Organization name contains invalid characters',
      'string.empty': 'Organization name is required',
      'any.required': 'Organization name is required'
    })
    .required(),
  organizationCategory: Joi.string()
    .valid('school', 'other')
    .messages({
      'any.only': 'Please select a valid organization category',
      'string.empty': 'Organization category is required',
      'any.required': 'Organization category is required'
    })
    .required(),
  schoolType: Joi.string()
    .valid('primary', 'secondary', 'tertiary')
    .when(Joi.ref('organizationCategory'), {
      is: 'school',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.only': 'Please select a valid school type',
      'string.empty': 'School type is required',
      'any.required': 'School type is required'
    }),
  schoolCategoryBoard: Joi.string()
    .valid(
      'privateSchool', 
      'methodistSchool', 
      'anglicanSchool', 
      'catholicSchool', 
      'publicPrimarySchool', 
      'publicSecondarySchool', 
      'publicTechnicalSchool', 
      'unitySchool', 
      'nonCategory', 
      'adultEducation', 
      'university', 
      'polytechnic', 
      'islamic', 
      'coe'
    )
    .when(Joi.ref('organizationCategory'), {
      is: 'school',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.only': 'Please select a valid school category board',
      'string.empty': 'School category board is required',
      'any.required': 'School category board is required'
    })
});

