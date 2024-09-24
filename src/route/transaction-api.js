import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { customerMiddleware } from "../middleware/customer-middleware.js";
import transactionController from "../controller/transaction-controller.js";
import { merchantMiddleware } from "../middleware/merchant-middleware.js"

class TransactionRouter {

    constructor() {
        this.router = new express.Router();
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/transactions', authMiddleware, customerMiddleware, transactionController.createTransaction);
        this.router.get('/transactions/history', authMiddleware, merchantMiddleware, transactionController.getCustomerHistoryTransaction)
    }

    getRouter() {
        return this.router;
    }
    
}

export const transactionRouter = new TransactionRouter().getRouter();