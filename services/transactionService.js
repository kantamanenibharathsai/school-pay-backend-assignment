import { Transaction } from '../models/transaction.js';

export const getTransactions = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { transaction_date: -1 } } = options;
  const transactions = await Transaction.find(filter)
    .select('collect_id school_id gateway order_amount transaction_amount status custom_order_id transaction_date')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort(sort);
  const total = await Transaction.countDocuments(filter);
  return { transactions, total }; 
};

export const getTransactionsBySchool = async (school_id, start_date, end_date) => {
  const filter = { school_id };
  if (start_date || end_date) {
    filter.transaction_date = {};
    if (start_date) filter.transaction_date.$gte = new Date(start_date);
    if (end_date) filter.transaction_date.$lte = new Date(end_date);
  }
  return Transaction.find(filter)
    .select('collect_id school_id gateway order_amount transaction_amount status custom_order_id transaction_date')
    .sort({ transaction_date: -1 });
};


export const getTransactionByCustomOrderId = async (custom_order_id) => {
  return Transaction.findOne({ custom_order_id }).select('status');
};


export const getTransactionByCollectId = async (collect_id) => {
  return Transaction.findOne({ collect_id });
};

export const updateTransactionStatus = async (custom_order_id, new_status) => {
  return Transaction.findOneAndUpdate(
    { custom_order_id },
    { status: new_status },
    { new: true }
  );
};

export const updateTransactionForWebhook = async (order_id, updateData) => {
  return Transaction.findOneAndUpdate(
    { collect_id: order_id },
    updateData,
    { new: true }
  );
};
