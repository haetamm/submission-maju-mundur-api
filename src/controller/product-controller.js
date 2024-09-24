import { ResponseSuccess } from "../entities/response-success.js";
import { productService } from "../service/product-service.js";

class ProductContoller {

    async getAll(req, res, next) {
        try {
            const result = await productService.getAll(req);
            const response = new ResponseSuccess(200, result);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    async storeProduct(req, res, next) {
        try {
            const result = await productService.storeProduct(req);
            const response = new ResponseSuccess(201, result);
            res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    }

    async getById(req, res, next) {
        try {
            const result = await productService.getById(req);
            const response = new ResponseSuccess(200, result);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    async updateById(req, res, next) {
        try {
            const result = await productService.updateById(req);
            const response = new ResponseSuccess(200, result);
            res.status(200).json(response);
        } catch (e) {
            next(e);
        }
    }

    async deleteById(req, res, next) {
        try {
            const result = await productService.deleteById(req);
            const response = new ResponseSuccess(204, result);
            res.status(204).json(response);
        } catch (e) {
            next(e);
        }
    }

}

export default new ProductContoller();