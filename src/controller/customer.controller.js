import Customer from "../models/customer.model.js";
import { handleError } from "../helper/error-handle.js";
import { successRes } from "../helper/success-response.js";
import { isValidObjectId } from "mongoose";
import { signInCustomerValidator, signUpCustomerValidator, updateCustomerValidator, confirmSignInCustomerValidator } from "../validation/customer.validation.js";
import config from "../config/index.js";
import { Token } from "../utils/token-service.js";
import { generateOTP } from "../helper/generate.otp.js"
import NodeCache from "node-cache";
import { transporter } from "../helper/send-mail.js"


const token = new Token();
const cache = new NodeCache();

export class CustomerController {
    async signUp(req, res) {
        try {
            const { value, error } = signUpCustomerValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const existsPhone = await Customer.findOne({ phone_number: value.phone_number });
            if (existsPhone) {
                return handleError(res, "Phone number already exists", 409);
            }
            const existsEmail = await Customer.findOne({ email: value.email });
            if (existsEmail) {
                return handleError(res, "Email adress already exists", 409);
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
                data: customer,
                token: accessToken
            }, 201);
        } catch (error) {
            handleError(res, error);

        }
    }
    async signIn(req, res) {
        try {
            const { value, error } = signInCustomerValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const email = value.email;
            const customer = await Customer.findOne({ email });
            if (!customer) {
                handleError(res, "Customer not found", 404);
            }
            const otp = generateOTP();
            const mailOptions = {
                from: config.MAIL_USER,
                to: email,
                subject: 'e-navbat',//ticket shop bolw kkgidi nomi
                text: otp
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return handleError(res, "Error on sending to email", 400)

                } else {
                    console.log(info);

                }
            })
            cache.set(email, otp, 120);
            return successRes(res, {
                message: "OTP sent successfuly to email"
            })
        } catch (error) {
            handleError(res, error)

        }
    }
    async confirmSignIn(req, res) {
        try {
            const { value, error } = confirmSignInCustomerValidator(req.body);
            if (error) {
                handleError(res, error, 422);
            }
            const customer = await Customer.findOne({ email: value.email })
            if (!customer) {
                return handleError(res, "Customer not found", 404);
            }
            const cacheOTP = cache.get(value.email);
            console.log(cacheOTP)
            if (!cacheOTP || cacheOTP != value.otp) {
                return handleError(res, "OTP expired", 400);
            }
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
                data: customer,
                token: accessToken
            }, 201);
        } catch (error) {
            handleError(res, error);

        }
    } catch(error) {
        handleError(res, error)

    }
    async newAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenCustomer
            if (!refreshToken) {
                return handleError(res, "Refresh token expired", 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY)
            if(!decodedToken){
                return handleError(res,"Invalid token",400);
            }
            const customer = await Customer.findById(decodedToken.id)
            if(!customer){
                return handleError(res,"Customer not found",404);
            }
            const payload = {id:customer._id};
            const accessToken = await token.generateAccessToken(payload)
            return successRes(res,{
                token:accessToken
            });
        } catch (error) {
            handleError(res, error)
        }
    }
    async logOut(req,res){
        try {
            const refreshToken = req.cookie?.refreshTokenCustomer
            if(!refreshToken){
                return handleError(res,"Refresh token expired",400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return handleError(res, 'Invalid token', 400);
            }
            const customer = await Customer.findById(decodedToken.id);
            if(!customer){
                return handleError(res,"Customer not found",404);
            }
            res.clearCookie('refreshTokenCustomer')
            return successRes(res,{})
        } catch (error) {
            handleError(res,error)
        }
    }
}
