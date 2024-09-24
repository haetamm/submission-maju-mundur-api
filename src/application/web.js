import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error-midleware.js";
import { authRouter } from "../route/auth-api.js";
import { productRouter } from "../route/product-api.js";
import { transactionRouter } from "../route/transaction-api.js";

class Web {

    constructor() {
        this.web = express();
        this.web.use(cors());
        this.web.use(express.json());
        this.web.use(express.urlencoded({ extended: true }));
        this.setupRoutes();
    }

    setupRoutes() {
        this.web.use('/api/v1/auth', authRouter);
        this.web.use('/api/v1', productRouter);
        this.web.use('/api/v1', transactionRouter);
        this.web.use(errorMiddleware);
    }

    listen(port, callback) {
        return this.web.listen(port, callback);
    }

    close(server, callback) {
        server.close(callback);
    }

}

export default Web;

