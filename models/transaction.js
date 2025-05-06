import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    collect_id: { type: String, required: true },
    school_id: { type: String, required: true },
    student_id: { type: String, required: true },
    gateway: { type: String },
    order_amount: { type: Number },
    transaction_amount: { type: Number },
    status: { type: String, enum: ['Success', 'Pending', 'Failed'], default: 'Pending' },
    custom_order_id: { type: String, required: true },
    transaction_id: { type: String, required: true },
    transaction_date: { type: Date, default: Date.now },
    bank_reference: { type: String }
}, { timestamps: true });

transactionSchema.index({ collect_id: 1, transaction_id: 1 }, { unique: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);
