import Joi from "joi";


export const createTicketValidator = (data) => {
    const ticketSchema = Joi.object({
        transport_id: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        price: Joi.number().required(),
        departure: Joi.date().required(),
        arrival: Joi.date().required(),
        customer_id: Joi.string().required()
    });
    return ticketSchema.validate(data);
}

export const updateTicketValidator = (data) => {
    const ticketSchema = Joi.object({
        transport_id: Joi.string().optional(),
        from: Joi.string().optional(),
        to: Joi.string().optional(),
        price: Joi.number().optional(),
        departure: Joi.date().optional(),
        arrival: Joi.date().optional(),
        customer_id: Joi.string().optional()
    });
    return ticketSchema.validate(data);
}

