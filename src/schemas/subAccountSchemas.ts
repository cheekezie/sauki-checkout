import Joi from "joi";

export const subAccountSchema = Joi.object({
  bankCode: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please select a bank',
      'any.required': 'Please select a bank'
    }),
  accountNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.empty': 'Please enter bank account number',
      'string.pattern.base': 'Account number must be exactly 10 digits',
      'any.required': 'Please enter bank account number'
    })
});

