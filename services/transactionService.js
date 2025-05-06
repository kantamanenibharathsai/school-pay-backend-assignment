import { Transaction } from '../models/transaction.js';


export const getTransactions = async (filter = {}, options = {}) => {
  const MAX_LIMIT = 100;
  const pageNum = Number(options.page) > 0 ? Number(options.page) : 1;
  const limitNum = Number(options.limit) > 0 ? Math.min(Number(options.limit), MAX_LIMIT) : 10;
  const sort = options.sort || { transaction_date: -1 };

  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: "students",
        localField: "student_id",
        foreignField: "student_id",
        as: "student"
      }
    },
    { $unwind: "$student" },
    {
      $project: {
        collect_id: 1,
        school_id: 1,
        student_id: 1,
        gateway: 1,
        order_amount: 1,
        transaction_amount: 1,
        status: 1,
        custom_order_id: 1,
        transaction_date: 1,
        bank_reference: 1,
        name: "$student.name",
        email: "$student.email",
        phone: "$student.phone"
      }
    },
    { $sort: sort },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum }
  ];

  const transactions = await Transaction.aggregate(pipeline);
  const total = await Transaction.countDocuments(filter);

  return { transactions, total };
};


export const getTransactionsBySchool = async (school_id, start_date, end_date) => {
  const match = { school_id };
  if (start_date || end_date) {
    match.transaction_date = {};
    if (start_date) match.transaction_date.$gte = new Date(start_date);
    if (end_date) match.transaction_date.$lte = new Date(end_date);
  }

  return Transaction.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "students",
        let: { school_id: "$school_id", student_id: "$student_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$school_id", "$$school_id"] },
                  { $eq: ["$student_id", "$$student_id"] }
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              student_id: 1,
              name: 1,
              email: 1,
              phone: 1
            }
          }
        ],
        as: "student"
      }
    },
    { $unwind: "$student" },
    {
      $project: {
        _id: 1,
        collect_id: 1,
        school_id: 1,
        gateway: 1,
        order_amount: 1,
        transaction_amount: 1,
        status: 1,
        custom_order_id: 1,
        transaction_date: 1,
        student: 1
      }
    },
    { $sort: { transaction_date: -1 } }
  ]);
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

// export const updateTransactionForWebhook = async (order_id, updateData) => {
//   return Transaction.findOneAndUpdate(
//     { collect_id: order_id },
//     updateData,
//     { new: true }
//   );
// };

export const getTransactionByCollectAndTransactionId = async (collect_id, transaction_id) => {
  return Transaction.findOne({ collect_id, transaction_id });
};

export const updateTransactionForWebhook = async (collect_id, transaction_id, updateData) => {
  return Transaction.findOneAndUpdate(
    { collect_id, transaction_id },
    updateData,
    { new: true }
  );
};

