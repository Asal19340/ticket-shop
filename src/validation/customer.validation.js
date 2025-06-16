import Joi from 'joi';

export const createCustomerValidator = (data) => {
    const customerSchema = Joi.object({
        email: Joi.string().email().required(),
        phone_number: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).required()
    });
    return customerSchema.validate(data);
};

export const updateCustomerValidator = (data) => {
    const customerSchema = Joi.object({
        email: Joi.string().email().optional(),
        phone_number: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).optional()
    });
    return customerSchema.validate(data);
}
