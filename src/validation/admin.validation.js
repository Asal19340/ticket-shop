import Joi from 'joi';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const createValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().pattern(passwordRegex).required()
    });
    return admin.validate(data);
};

export const updateValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().pattern(passwordRegex).optional()
    });
    return admin.validate(data);
};
