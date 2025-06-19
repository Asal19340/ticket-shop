import { isValidObjectId } from "mongoose";
import Transport from "../models/transport.model.js";
import Ticket from "../models/ticket.model.js";
import { updateTransportValidator, createTransportValidator } from "../validation/transport.validation.js";
import { handleError } from "../helper/error-handle.js";
import { successRes } from "../helper/success-response.js";


export class TransportController {
    async createTransport(req, res) {
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const transport = await Transport.create(value);
            return successRes(res, transport, 201);
        } catch (error) {
            handleError(res, error);
        }
    }
    async getAllTransports(req, res) {
        try {
            const transport = await Transport.find().populate('ticket');
            return successRes(res, transport, 200);
        } catch (error) {
            handleError(res, error);
        }
    }
    async getTransportById(req, res) {
        try {
            const transport = await TransportController.gettransportById(res, req.params.id);
            return successRes(res, transport, 200);
        } catch (error) {
            handleError(res, error);
        }
    }
    async updateTransport(req, res) {
        try {
            const { value, error } = updateTransportValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            await TransportController.gettransportById(res, req.params.id);
            const updatedTrasnport = await Transport.findByIdAndUpdate(req.params.id, value, { new: true });
            return successRes(res, updatedTrasnport, 200);
        } catch (error) {
            handleError(res, error);
        }
    }
    async deleteTransport(req, res) {
        try {
            const id = req.params.id;
            await TransportController.gettransportById(res, id);
            await Transport.findByIdAndDelete(id);
            await Ticket.deleteMany({ transport_id: id });
            return successRes(res, null,);
        } catch (error) {
            handleError(res, error);
        }
    }
    static async gettransportById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return handleError(res, "Invalid transport ID", 400);
            }
            const transport = await Transport.findById(id).populate('ticket');
            if (!transport) {
                return handleError(res, 404);
            }
            return transport;
        } catch (error) {
            handleError(res, error);
        }
    }
}


