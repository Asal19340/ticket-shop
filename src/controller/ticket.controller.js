import { handleError } from "../helper/error-handle.js";
import { successRes } from "../helper/success-response.js";
import { createTicketValidator, updateTicketValidator } from "../validation/ticket.validator.js";
import Ticket from "../models/ticket.model.js";
import Transport from "../models/transport.model.js";
import { isValidObjectId } from "mongoose";

export class TicketController {
    async createTicket(req, res) {
        try {
            const {value,error} = createTicketValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            if(!isValidObjectId(value.transport_id)) {
                return handleError(res, "Invalid transport ID", 400);
            }
            const existsTransport = await Transport.findById(value.transport_id);
            if (!existsTransport) {
                return handleError(res, "Transport not found", 404);
            }
            const ticket = await Ticket.create({
                transport_id: value.transport_id,
                from: value.from,
                to: value.to,
                price: value.price,
                departure: value.departure,
                arrival: value.arrival,
                customer_id: value.customer_id
            });
            return successRes(res, ticket, "Ticket created successfully", 201);
        } catch (error) {
            handleError(res, error);
        }
    }
    async getAllTickets(req, res) {
        try {
            const tickets = await Ticket.find().populate('transport_id');
            return successRes(res, tickets, "All tickets fetched successfully", 200);
        } catch (error) {
            handleError(res, error);   
        }
    }
    async getTicketById(req, res) {
        try {
            const ticket = await TicketController.getTicketsById(res, req.params.id);
            return successRes(res, ticket, "Ticket fetched successfully", 200);
        } catch (error) {
            handleError(res, error);
        }
    }
    async updateTicket(req,res){
        try {
            const id = req.params.id;
            await TicketController.getTicketsById(res, id);
            const {value, error} = updateTicketValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            if (value.transport_id && !isValidObjectId(value.transport_id)) {
                return handleError(res, "Invalid transport ID", 400);
            }
            if (value.transport_id) {
                const existsTransport = await Transport.findById(value.transport_id);
                if (!existsTransport) {
                    return handleError(res, "Transport not found", 404);
                }
            }
            const updatedTicket = await Ticket.findByIdAndUpdate(id,value, { new: true });
            return successRes(res, updatedTicket, "Ticket updated successfully", 200);
        } catch (error) {
            handleError(res, error);
        }
    }
    async deleteTicket(req, res) {
        try {
            const id = req.params.id;
            await TicketController.getTicketsById(res, id);
            await Ticket.findByIdAndDelete(id);
            return successRes(res, null, "Ticket deleted successfully");
        } catch (error) {
            handleError(res, error);
        }
    }
    static async getTicketsById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return handleError(res, "Invalid ticket ID", 400);
            }
            const ticket = await Ticket.findById(id).populate('transport_id');
            if (!ticket) {
                return handleError(res, "Ticket not found", 404);
            }
            return ticket;
        } catch (error) {
            handleError(res, error);
        }
    }
}
