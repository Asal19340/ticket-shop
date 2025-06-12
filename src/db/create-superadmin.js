import Admin from '../models/admin.model.js';
import { Crypto } from '../utils/encrypt-decrypt.js';
import {config} from 'dotenv';
config();

const crypto = new Crypto();

export const createSuperAdmin = async () => {
    try {
        const existsSuperAdmin = await Admin.findOne({role:'superadmin'})
        if(existsSuperAdmin){
            const hashedPassword = await crypto.encrypt(process.env.SUPERADMIN_USERNAME);
            await Admin.create({
                username:process.env.SUPERADMIN_USERNAME,
                hashedPassword,
                role:'superadmin'
            });
            console.log('Superadmin created successfully');
        }
    } catch (error) {
        console.error('Error creating superadmin:', error);
    }
}