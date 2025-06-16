import Customer from "../models/customer.model.js";
import { handleError } from "../helper/error-handle.js";
import { successRes } from "../helper/success-response.js";
import { isValidObjectId } from "mongoose";
import { createCustomerValidator } from "../validation/customer.validation.js";
import config from "../config/index.js";
import {Token} from "../utils/token-service.js";

const token = new Token();

export class CustomerController {
    async SignUp(req, res) {
        try {
            const {value,error} = createCustomerValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const existsPhone = await Customer.findOne({phone_number: value.phone_number});
            if (existsPhone) {
                return handleError(res, "Phone number already exists", 409);
            }
            const customer = await Customer.create(value);
            const payload = {
                id: customer._id
            };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenPatient', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return successRes(res, {
                data: patient,
                token: accessToken
            }, 201);
        } catch (error) {
            handleError(res, error);
            
        }
    }
}