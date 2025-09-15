import { Crypto } from "../utils/encrypt-decrypt.js";
import config from "../config/index.js";
import Admin from "../models/admin.model.js";

const crypto = new Crypto();

export const createSuperAdmin = async () => {
    try {
        const hashedPassword = await crypto.encrypt(config.SUPERADMIN_PASSWORD);
        const existingAdmin = await Admin.findOne({ username: config.SUPERADMIN_USERNAME });
        if (existingAdmin) {
            console.log("✅ Superadmin already exists with username:", existingAdmin.username);
            return;
        }
        const superAdmin = await Admin.create({
            username: config.SUPERADMIN_USERNAME,
            email: config.SUPERADMIN_EMAIL,
            phone: config.SUPERADMIN_PHONE,
            hashedPassword,
            role: 'superadmin'
        });
        console.log("✅ Super admin created:", superAdmin.username);
    } catch (error) {
        console.log("❌ Error creating superadmin:", error);
    }
};
