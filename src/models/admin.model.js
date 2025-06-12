import { Schema, model } from 'mongoose';

const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
}, {
    timestamps: true
})

export default model('Admin', AdminSchema);