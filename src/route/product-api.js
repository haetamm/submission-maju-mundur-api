import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import productController from "../controller/product-controller.js";
import { merchantMiddleware } from "../middleware/merchant-middleware.js";

class ProductRouter {

    constructor() {
        this.router = new express.Router();
        this.setupRoutes()
    }

    setupRoutes() {
        this.router.get('/products', authMiddleware, productController.getAll);
        this.router.post('/products', authMiddleware, merchantMiddleware, productController.storeProduct);
        this.router.get('/products/:id', authMiddleware, productController.getById);
        this.router.put('/products/:id', authMiddleware, merchantMiddleware, productController.updateById);
        this.router.delete('/products/:id', authMiddleware, merchantMiddleware, productController.deleteById);
    }

    getRouter() {
        return this.router;
    }
    
}

export const productRouter = new ProductRouter().getRouter();