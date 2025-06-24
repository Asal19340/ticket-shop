import { Router } from "express";
import { CustomerController } from "../controller/customer.controller.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { RolesGuard } from "../guard/roles.guard.js";
import { SelfGuard } from "../guard/self.guard.js";

const router = Router();
const controller = new CustomerController();

router
    .post('/signup', controller.signUp)
    .post('/signin', controller.signIn)
    .post('/confirm-signin', controller.confirmSignIn)
    .post('/token', AuthGuard, controller.newAccessToken)
    .post('/logout', AuthGuard, controller.logOut)
    .get('/', AuthGuard, RolesGuard(['superadmin', 'admin']), controller.getAllCustomer)
    .get('/:id', AuthGuard, SelfGuard, controller.getCustomerById)
    .patch('/:id', AuthGuard, SelfGuard, controller.updateCustomer)
    .delete('/:id', AuthGuard, SelfGuard, controller.deleteCustomer)

export default router;
