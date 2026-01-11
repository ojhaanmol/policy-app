const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    delivered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

MessageSchema.index({ scheduledAt: 1, delivered: 1 });

module.exports = mongoose.model('Message', MessageSchema);
