import { handleError } from "../helper/error-handle.js";
import { successRes } from "../helper/success-response.js";
import { createTicketValidator, updateTicketValidator } from "../validation/ticket.validator.js";
import Ticket from "../models/ticket.model.js";
import Transport from "../models/transport.model.js";
import { isValidObjectId } from "mongoose";

export class TicketController {
    async createTicket(req, res) {
        try {
            const { value, error } = createTicketValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }

            if (!isValidObjectId(value.transport_id)) {
                return handleError(res, "Invalid transport ID", 400);
            }
            const existsTransport = await Transport.findById(value.transport_id);
            if (!existsTransport) {
                return handleError(res, 404);
            }
            const ticket = await Ticket.create({
                transport_id: value.transport_id,
                from: value.from,
                to: value.to,
                price: value.price,
                departure: value.departure,
                arrival: value.arrival,
                customer_id: req.user.id // <== AVTOMATIK foydalanuvchidan olinadi
            });
            return successRes(res, ticket, 201);
        } catch (error) {
            handleError(res, error);
        }
    }
    async getAllTickets(req, res) {
        try {
            const tickets = await Ticket.find().populate('transport_id');
            return successRes(res, tickets, 200);
        } catch (error) {
            handleError(res, error);
        }
    }
    async getTicketById(req, res) {
        try {
            const ticket = await TicketController.getTicketsById(res, req.params.id);
            // <== FOYDALANUVCHI CHECK
            if (req.user.role !== 'superadmin' && req.user.id !== ticket.customer_id.toString()) {
                return handleError(res, "Forbidden", 403);
            }
            return successRes(res, ticket, 200);
        } catch (error) {
            handleError(res, error);
        }
    }
    async updateTicket(req, res) {
        try {
            const id = req.params.id;
            const ticket = await TicketController.getTicketsById(res, id);
            // <== FOYDALANUVCHI CHECK
            if (req.user.role !== 'superadmin' && req.user.id !== ticket.customer_id.toString()) {
                return handleError(res, "Forbidden", 403);
            }
            const { value, error } = updateTicketValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            if (value.transport_id && !isValidObjectId(value.transport_id)) {
                return handleError(res, "Invalid transport ID", 400);
            }
            if (value.transport_id) {
                const existsTransport = await Transport.findById(value.transport_id);
                if (!existsTransport) {
                    return handleError(res, 404);
                }
            }
            const updatedTicket = await Ticket.findByIdAndUpdate(id, value, { new: true });
            return successRes(res, updatedTicket, 200);
        } catch (error) {
            handleError(res, error);
        }
    }
    async deleteTicket(req, res) {
        try {
            const id = req.params.id;
            const ticket = await TicketController.getTicketsById(res, id);
            // <== FOYDALANUVCHI CHECK
            if (req.user.role !== 'superadmin' && req.user.id !== ticket.customer_id.toString()) {
                return handleError(res, "Forbidden", 403);
            }
            await Ticket.findByIdAndDelete(id);
            return successRes(res, null);
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
                return handleError(res, 404);
            }

            return ticket;
        } catch (error) {
            handleError(res, error);
        }
    }
}
