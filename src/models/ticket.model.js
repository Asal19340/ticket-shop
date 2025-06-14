import {model,Schema} from 'mongoose';


const ticketSchema = new Schema({
    transport_id: { type: Schema.Types.ObjectId, ref: 'Transport', required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    price: { type: Number, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
},{
    timestamps: true,
});

const Ticket = model('Ticket', ticketSchema);
export default Ticket;