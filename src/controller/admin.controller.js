import Admin from '../models/admin.model.js';
import { Crypto } from '../utils/encrypt-decrypt.js';
import { handleError } from '../helper/error-handle.js';
import { successRes } from '../helper/success-response.js';
import { createValidator,updateValidator } from '../validation/admin.validation.js';
import { isValidObjectId } from 'mongoose';

const crypto = new Crypto();

export class AdminController {
    async createAdmin(req, res) {
        try {
            const {value,error} = createValidator(req.body)
            if(error){
                return handleError(res,error,422)
            }
            const existsUsername = await Admin.findOne({ username: value.username });
            if (existsUsername) {
                return handleError(res, "Username already exists", 409);
            }
            const hashedPassword = await crypto.encrypt(value.password);
            const admin = await Admin.create({
                username: value.username,
                hashedPassword
            });
            return successRes(res, admin, 201);
        } catch (error) {
            return handleError(res, error);
        }
    }
    async getAllAdmins(req, res) {
        try {
            const admins = await Admin.find();
            return successRes(res, admins);
        } catch (error) {
            return handleError(res, error);
            
        }
    }
    async getAdminById(req,res) {
        try {
            const admin = await AdminController.findAdminById(req.params.id);
            return successRes(res, admin);
        } catch (error) {
            return handleError(res, error);
        }
    }
    async updateAdmin(req,res) {
        try {
            const id = req.params.id;
            const admin = await AdminController.findAdminById(res,id);
            const {value,error} = updateValidator(req.body);
            if(error){
                return handleError(res,error,422)
            }
            let hashedPassword = admin.hashedPassword;
            if (value.password) {
                hashedPassword = await crypto.encrypt(value.password);
            }
            const updateAdmin = await Admin.findByIdAndUpdate(id,{
                ...value,
                hashedPassword
            },{new:true});
            return successRes(res, updateAdmin);
        } catch (error) {
            return handleError(res, error);
        }
    }
    async deleteAdmin(req,res) {
        try {
            const id = req.params.id;
            await AdminController.findAdminById(res,id);
            await Admin.findByIdAndDelete(id);
            return successRes(res,{message:'Admin deleted successfully'});
        } catch (error) {
            return handleError(res, error);
            
        }
    }
    static async findAdminById(res,id){
        try {
            if(!isValidObjectId(id)){
                return handleError(res,'Invalid admin id',422);
            }
            const admin = await Admin.findById(id);
            if(!admin){
                return handleError(res,'Admin not found',404);
            }
            return admin;
        } catch (error) {
            return handleError(res, error);
        }
    }
}
