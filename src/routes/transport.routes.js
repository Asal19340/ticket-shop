import { Router } from "express";
import { TransportController } from "../controller/transport.controller.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { RolesGuard } from "../guard/roles.guard.js";

const router = Router();
const controller = new TransportController();

router
    .post('/', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.createTransport)
    .get('/', AuthGuard,controller.getAllTransports)
    .get('/:id',AuthGuard ,controller.getTransportById)
    .patch('/:id', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.updateTransport)
    .delete('/:id', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.deleteTransport);

export default router;
