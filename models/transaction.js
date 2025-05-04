const transactionSchema = new mongoose.Schema({
    collect_id: { type: String, required: true, unique: true },
    school_id: { type: String, required: true },
    student_id: { type: String, required: true },
    gateway: { type: String },
    order_amount: { type: Number },
    transaction_amount: { type: Number },
    status: { type: String, enum: ['Success', 'Pending', 'Failed'], default: 'Pending' },
    custom_order_id: { type: String, required: true, unique: true },
    transaction_date: { type: Date, default: Date.now },
    bank_reference: { type: String }
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);
