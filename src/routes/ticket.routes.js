import { Router } from "express";
import { TicketController } from "../controller/ticket.controller.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { RolesGuard } from "../guard/roles.guard.js";
import { SelfGuard } from "../guard/self.guard.js";

const router = Router();
const controller = new TicketController();

router
    .post("/", AuthGuard, RolesGuard(['customer']), controller.createTicket)
    .get("/", AuthGuard, RolesGuard(['admin', 'superadmin']), controller.getAllTickets)
    .get("/:id", AuthGuard, controller.getTicketById) // ichida o‘zi yoki admin/superadmin tekshiriladi
    .patch("/:id", AuthGuard, SelfGuard,controller.updateTicket) // tekshiruv controller ichida boladi
    .delete("/:id", AuthGuard, controller.deleteTicket)

export default router;
