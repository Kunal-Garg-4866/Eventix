import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    eventType: { type: String, enum: ['solo', 'team'], required: true },
    teamSizeMin: { type: Number, default: 1, min: 1 },
    teamSizeMax: { type: Number, default: 1, min: 1 },
    date: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    image: { type: String, default: '' },
    society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
