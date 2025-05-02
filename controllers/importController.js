import { parseCSV } from '../utils/csvParser.js';
import { Student } from '../models/student.js';
import { Transaction } from '../models/transaction.js';

export const importStudents = async (_req, res, next) => {
    try {
        const students = await parseCSV('data/student.csv');
        await Student.insertMany(students);
        res.status(200).json({ message: 'Students imported successfully' });
    } catch (error) {
        next(error);
    }
};

export const importTransactions = async (_req, res, next) => {
    try {
        const transactions = await parseCSV('data/transactions.csv');
        await Transaction.insertMany(transactions);
        res.status(200).json({ message: 'Transactions imported successfully' });
    } catch (error) {
        next(error);
    }
};
