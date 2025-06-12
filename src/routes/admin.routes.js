import { Router } from "express";
import { AdminController } from "../controller/admin.controller.js";

const router = Router();
const controller = new AdminController();

router
    .post('/', controller.createAdmin)
    .get('/', controller.getAllAdmins)
    .get('/:id', controller.getAdminById)
    .patch('/:id', controller.updateAdmin)
    .delete('/:id', controller.deleteAdmin)

export default router;