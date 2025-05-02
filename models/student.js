import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    student_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    school_id: { type: String, required: true },
    class: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        type: String
    }
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);