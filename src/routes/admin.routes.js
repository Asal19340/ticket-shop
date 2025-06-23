import { Router } from "express";
import { AdminController } from "../controller/admin.controller.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { RolesGuard } from "../guard/roles.guard.js";
import { SelfGuard } from "../guard/self.guard.js";


const router = Router();
const controller = new AdminController();

router
    .post('/', AuthGuard, RolesGuard(['superadmin']), controller.createAdmin)
    .post('/signin', controller.signInAdmin)
    .post('/token', controller.newAccessToken)
    .post('/logout', AuthGuard, controller.logOut)
    .get('/', AuthGuard, RolesGuard(['superadmin']), controller.getAllAdmins)
    .get('/:id',AuthGuard,SelfGuard,controller.getAdminById)
    .patch('/:id', controller.updateAdmin)
    .delete('/:id', controller.deleteAdmin)

export default router;