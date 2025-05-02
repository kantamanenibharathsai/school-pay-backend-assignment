import { Router } from 'express';
import { importStudents, importTransactions } from '../controllers/importController.js';

export const importRoutes = Router();


/**
 * @swagger
 * /api/import/students:
 *   post:
 *     summary: Import students data
 *     tags:
 *       - Import
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Students imported successfully
 *       400:
 *         description: Bad request (e.g. missing or invalid file)
 *       401:
 *         description: Unauthorized
 *       415:
 *         description: Unsupported Media Type (e.g. wrong file type)
 *       500:
 *         description: Internal server error
 */
importRoutes.post('/import/students', importStudents);

/**
 * @swagger
 * /api/import/transactions:
 *   post:
 *     summary: Import transactions data
 *     tags:
 *       - Import
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Transactions imported successfully
 *       400:
 *         description: Bad request (e.g. missing or invalid file)
 *       401:
 *         description: Unauthorized
 *       415:
 *         description: Unsupported Media Type (e.g. wrong file type)
 *       500:
 *         description: Internal server error
 */
importRoutes.post('/import/transactions', importTransactions);



