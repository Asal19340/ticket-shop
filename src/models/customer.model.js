import {model, Schema} from "mongoose";

const customerSchema = new Schema({
    email:{type: String, required: true, unique: true},
    phone_number: {type: String, required: true, unique: true},
});

const Customer = model('Customer', customerSchema);
export default Customer;