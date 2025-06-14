import { model, Schema } from 'mongoose';

const transportSchema = new Schema({
  transport_type: { type: String, required: true },
  class: { type: String, enum: ['economy', 'business', 'first'], required: true },
  seat: { type: Number, required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

transportSchema.virtual('ticket', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'transport_id',
});

const Transport = model('Transport', transportSchema);
export default Transport;
