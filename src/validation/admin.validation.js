import Joi from 'joi';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const phoneRegex = /^(\+998|998)(9[012345789]|3[3]|7[1])\d{7}$/;

export const createAdminValidator = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(phoneRegex).required(),
        password: Joi.string().pattern(passwordRegex).required(),
        role: Joi.string().valid('admin', 'superadmin').optional()
    });
    return schema.validate(data);
};


export const SignInAdminValidator = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};

export const updateAdminValidator = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(phoneRegex).required(),
        password: Joi.string().pattern(passwordRegex).required(),
        role: Joi.string().valid('admin', 'superadmin').optional()
    });
    return schema.validate(data);
};
