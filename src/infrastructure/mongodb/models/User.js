const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, index: true },
        email: { type: String, index: true },
        phone: String,
        gender: String,
        dob: Date,
        address: String,
        city: String,
        state: String,
        zip: String,
        userType: String
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
