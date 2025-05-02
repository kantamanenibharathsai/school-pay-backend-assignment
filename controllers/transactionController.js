import {
  getTransactions,
  getTransactionsBySchool,
  getTransactionByCustomOrderId,
  getTransactionByCollectId,
  updateTransactionStatus,
  updateTransactionForWebhook,
} from "../services/transactionService.js";


export const getAllTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const search_term = req.query.searchTerm;
    const start_date = req.query.startDate;
    const end_date = req.query.endDate;

    if (isNaN(page) || Number(page) <= 0) {
      return res.status(400).json({ message: "Page must be a positive integer." });
    }
    if (isNaN(limit) || Number(limit) <= 0) {
      return res.status(400).json({ message: "Limit must be a positive integer." });
    }

    if (start_date && isNaN(Date.parse(start_date))) {
      return res.status(400).json({ message: "Invalid startDate format. Please use YYYY-MM-DD." });
    }
    if (end_date && isNaN(Date.parse(end_date))) {
      return res.status(400).json({ message: "Invalid endDate format. Please use YYYY-MM-DD." });
    }

    const filter = {};
    if (status) filter.status = status;
    if (search_term) {
      filter.$or = [
        { collect_id: { $regex: search_term, $options: "i" } },
        { custom_order_id: { $regex: search_term, $options: "i" } },
      ];
    }
    if (start_date || end_date) {
      filter.transaction_date = {};
      if (start_date) filter.transaction_date.$gte = new Date(start_date);
      if (end_date) filter.transaction_date.$lte = new Date(end_date);
    }

    const { transactions, total } = await getTransactions(filter, {
      page: Number(page),
      limit: Number(limit),
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        message: "No transactions found matching your criteria.",
        page: Number(page),
        totalPages: 0,
        totalRecords: 0,
        data: [],
      });
    }

    res.status(200).json({
      message: "Transactions fetched successfully.",
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Please try again later.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};






export const getTransactionsBySchoolController = async (req, res, next) => {
  try {
    const { school_id } = req.params;
    const start_date = req.query.startDate;
    const end_date = req.query.endDate;

    if (!school_id)
      return res.status(400).json({ message: "School ID is required." });

    if (!/^SCH\d{3,}$/.test(school_id))
      return res.status(400).json({ message: "Invalid School ID format. Expected format: SCH followed by at least 3 digits (e.g., SCH002)." });

    const transactions = await getTransactionsBySchool(
      school_id,
      start_date,
      end_date
    );

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for the given School ID." });
    }
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};


export const checkTransactionStatus = async (req, res, next) => {
  try {
    const { custom_order_id } = req.params;
    if (!custom_order_id) {
      return res.status(400).json({ message: "Custom order ID is required." });
    }
    if (!/^ORD\d{4,}$/.test(custom_order_id)) {
      return res.status(400).json({ message: "Invalid custom order ID format. Expected format: ORD followed by at least 4 digits (e.g., ORD1242)." });
    }
    const transaction = await getTransactionByCustomOrderId(custom_order_id);
    if (!transaction) {
      return res.status(404).json({ message: `No transaction found for order ID '${custom_order_id}'.` });
    }
    res.status(200).json({
      message: `Transaction status fetched successfully for order ID '${custom_order_id}'.`,
      status: transaction.status
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};


export const webhookTransactionStatus = async (req, res, next) => {
  try {
    const { status, order_info } = req.body;
    if (!order_info || typeof status === 'undefined') {
      return res.status(400).json({ message: "Both 'status' and 'order_info' are required in the request body." });
    }
    const requiredFields = ['order_id', 'order_amount', 'transaction_amount', 'gateway', 'bank_reference'];
    const missingFields = requiredFields.filter(field => !order_info[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing fields in order_info: ${missingFields.join(', ')}` });
    }

    if (!/^ORD\d{4,}$/.test(order_info.order_id)) {
      return res.status(400).json({ message: "Invalid order_id format. Expected format: ORD followed by at least 4 digits (e.g., ORD1234)." });
    }
    if (typeof status !== 'number') {
      return res.status(400).json({ message: "'status' must be a number (e.g., 200 for success)." });
    }
    const transaction = await getTransactionByCollectId(order_info.order_id);
    if (!transaction) {
      return res.status(404).json({ message: `Transaction not found for order ID '${order_info.order_id}'.` });
    }
    const updatedTransaction = await updateTransactionForWebhook(order_info.order_id, {
      status: status === 200 ? "Success" : "Failed",
      order_amount: order_info.order_amount,
      transaction_amount: order_info.transaction_amount,
      gateway: order_info.gateway,
      bank_reference: order_info.bank_reference,
    });

    res.status(200).json({
      message: `Transaction updated to '${status === 200 ? "Success" : "Failed"}' for order ID '${order_info.order_id}'.`,
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};


export const manualUpdateTransaction = async (req, res, next) => {
  try {
    const { custom_order_id, new_status } = req.body;
    if (!custom_order_id || !new_status) {
      return res.status(400).json({ message: "Both custom_order_id and new_status are required." });
    }
    if (!/^ORD\d{4,}$/.test(custom_order_id)) {
      return res.status(400).json({ message: "Invalid custom order ID format. Expected format: ORD followed by at least 4 digits (e.g., ORD1234)." });
    }
    const validStatuses = ["Pending", "Success", "Failed"];
    if (!validStatuses.includes(new_status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${validStatuses.join(", ")}` });
    }
    const transaction = await updateTransactionStatus(custom_order_id, new_status);

    if (!transaction) {
      return res.status(404).json({ message: `No transaction found for order ID '${custom_order_id}'.` });
    }
    res.status(200).json({
      message: `Transaction status updated to '${new_status}' for order ID '${custom_order_id}'.`,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
