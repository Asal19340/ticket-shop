import Joi from "joi";

export const createTransportValidator = (data) => {
    const schema = Joi.object({
      transport_type: Joi.string().required(),
      class: Joi.string().valid('economy', 'business', 'first').required(),
      seat: Joi.number().integer().min(1).required()
    });
    return schema.validate(data);
  };
  
  export const updateTransportValidator = (data) => {
    const schema = Joi.object({
      transport_type: Joi.string(),
      class: Joi.string().valid('economy', 'business', 'first'),
      seat: Joi.number().integer().min(1)
    });
    return schema.validate(data);
};
  
