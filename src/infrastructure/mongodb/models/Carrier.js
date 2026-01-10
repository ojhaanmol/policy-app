const mongoose = require('mongoose');

const CarrierSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            unique: true,
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Carrier', CarrierSchema);
