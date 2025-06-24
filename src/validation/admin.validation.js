import Joi from 'joi';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const createAdminValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().pattern(passwordRegex).required()
    });
    return admin.validate(data);
};

export const SignInAdminValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().required()
    });
    return admin.validate(data);
};

export const updateAdminValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().pattern(passwordRegex).optional()
    });
    return admin.validate(data);
};
