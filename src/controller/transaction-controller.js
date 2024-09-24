import { ResponseSuccess } from "../entities/response-success.js";
import { transactionService } from "../service/transaction-service.js";

class TransactionController {

    async createTransaction(req, res, next) {
        try {
            const result = await transactionService.createTransaction(req);
            const response = new ResponseSuccess(201, result);
            res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getCustomerHistoryTransaction(req, res, next) {
        try {
            const result = await transactionService.getCustomerHistoryTransaction(req);
            const response = new ResponseSuccess(200, result);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

}

export default new TransactionController();