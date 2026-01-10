const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema(
    {
        policyNumber: {
            type: String,
            required: true,
            index: true
        },

        policyStartDate: {
            type: Date,
            required: true
        },

        policyEndDate: {
            type: Date,
            required: true,
            index: true
        },

        premium_amount: {
            type: Number,
            default: 0
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        companyCollectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Carrier',
            required: true,
            index: true
        },

        policyCategoryCollectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LOB',
            required: true,
            index: true
        }
    },
    { timestamps: true }
);

PolicySchema.index({ userId: 1, policyEndDate: 1 });

module.exports = mongoose.model('Policy', PolicySchema);
