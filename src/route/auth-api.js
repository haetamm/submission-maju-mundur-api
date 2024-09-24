import express from "express";
import authController from "../controller/auth-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

class AuthRouter {

    constructor() {
        this.router = new express.Router();
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.post('/login', authController.login);
        this.router.post('/regis/customer', authController.createCustomer);
        this.router.post('/regis/merchant', authController.createMerchant);
        this.router.delete('/logout', authMiddleware, authController.logout);
    }

    getRouter() {
        return this.router;
    }
    
}

export const authRouter = new AuthRouter().getRouter();