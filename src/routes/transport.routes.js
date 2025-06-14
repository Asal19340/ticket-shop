import { Router } from "express";
import { TransportController } from "../controller/transport.controller.js";


const router = Router();
const controller = new TransportController();

router

    .post('/', controller.createTransport)
    .get('/', controller.getAllTransports)
    .get('/:id', controller.getTransportById)
    .patch('/:id', controller.updateTransport)
    .delete('/:id', controller.deleteTransport);

export default router;