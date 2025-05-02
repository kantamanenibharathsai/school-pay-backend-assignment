import { Router } from 'express';
import {
    getAllTransactions,
    checkTransactionStatus,
    webhookTransactionStatus,
    manualUpdateTransaction,
    getTransactionsBySchoolController
} from '../controllers/transactionController.js';

export const transactionRoutes = Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: List of transactions
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
transactionRoutes.get('/transactions', getAllTransactions);

/**
 * @swagger
 * /api/transactions/school/{school_id}:
 *   get:
 *     summary: Get transactions by school ID
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: school_id
 *         required: true
 *         schema:
 *           type: string
 *         description: School ID
 *     responses:
 *       200:
 *         description: List of transactions for the school
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: School not found
 *       500:
 *         description: Internal server error
 */
transactionRoutes.get('/transactions/school/:school_id', getTransactionsBySchoolController);

/**
 * @swagger
 * /api/transactions/check-status/{custom_order_id}:
 *   get:
 *     summary: Check transaction status by custom order ID
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: custom_order_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom order ID
 *     responses:
 *       200:
 *         description: Transaction status
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
transactionRoutes.get('/transactions/check-status/:custom_order_id', checkTransactionStatus);

/**
 * @swagger
 * /api/webhook/transaction-status:
 *   post:
 *     summary: Webhook for transaction status updates
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
transactionRoutes.post('/webhook/transaction-status', webhookTransactionStatus);

/**
 * @swagger
 * /api/transactions/manual-update:
 *   post:
 *     summary: Manually update a transaction
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
transactionRoutes.post('/transactions/manual-update', manualUpdateTransaction);
