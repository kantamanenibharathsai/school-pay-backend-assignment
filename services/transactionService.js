import { Transaction } from '../models/transaction.js';
// import {Student} from '../models/student.js';

// export const getTransactions = async (filter = {}, options = {}) => {
//   const MAX_LIMIT = 100;
//   const pageNum = Number(options.page) > 0 ? Number(options.page) : 1;
//   const limitNum = Number(options.limit) > 0 ? Math.min(Number(options.limit), MAX_LIMIT) : 10;
//   const sort = options.sort || { transaction_date: -1 };
//   const transactions = await Transaction.find(filter)
//     .select('collect_id school_id gateway order_amount transaction_amount status custom_order_id transaction_date')
//     .skip((pageNum - 1) * limitNum)
//     .limit(limitNum)
//     .sort(sort);
//   const total = await Transaction.countDocuments(filter);

//   return { transactions, total };
// };
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
        localField: "school_id",
        foreignField: "school_id",
        as: "students"
      }
    },
    { $unwind: "$students" },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$$ROOT",
            {
              student_id: "$students.student_id",
              name: "$students.name",
              email: "$students.email",
              phone: "$students.phone"
            }
          ]
        }
      }
    },
    {
      $project: {
        students: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0
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


// export const getTransactionsBySchoolWithStudents = async (school_id, start_date, end_date) => {
//   const match = { school_id };
//   if (start_date || end_date) {
//     match.transaction_date = {};
//     if (start_date) match.transaction_date.$gte = new Date(start_date);
//     if (end_date) match.transaction_date.$lte = new Date(end_date);
//   }

//   return Transaction.aggregate([
//     { $match: match },
//     {
//       $lookup: {
//         from: "students",
//         localField: "school_id",
//         foreignField: "school_id",
//         as: "students"
//       }
//     },
//     {
//       $project: {
//         collect_id: 1,
//         school_id: 1,
//         gateway: 1,
//         order_amount: 1,
//         transaction_amount: 1,
//         status: 1,
//         custom_order_id: 1,
//         transaction_date: 1,
//         students: {
//           student_id: 1,
//           name: 1,
//           email: 1,
//           phone: 1
//         }
//       }
//     },
//     { $sort: { transaction_date: -1 } }
//   ]);
// };
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
        localField: "school_id",
        foreignField: "school_id",
        as: "student"
      }
    },
    { $unwind: "$student" },
    {
      $project: {
        collect_id: 1,
        school_id: 1,
        gateway: 1,
        order_amount: 1,
        transaction_amount: 1,
        status: 1,
        custom_order_id: 1,
        transaction_date: 1,
        "student.student_id": 1,
        "student.name": 1,
        "student.email": 1,
        "student.phone": 1
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

export const updateTransactionForWebhook = async (order_id, updateData) => {
  return Transaction.findOneAndUpdate(
    { collect_id: order_id },
    updateData,
    { new: true }
  );
};
