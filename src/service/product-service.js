
import { productValidation } from '../validation/product-validation.js'
import {productRepository} from '../repository/product-repository.js';
import { prismaClient } from "../application/database.js";
import { validate } from '../validation/validation.js';
import { ResponseError } from '../entities/response-error.js';
import { merchantRepository } from '../repository/merchant-repository.js';

class ProductService {

    async getAll() {
        return await productRepository.getAllProduct();
    }

    async storeProduct({ body, user }) {
        const productRequest = validate(productValidation, body);
        try {
            const newProduct = await prismaClient.$transaction(async (prismaTransaction) => {
                const merchant = await merchantRepository.findMerchantByUserId(user.id, prismaTransaction);
                if (!merchant) {
                    throw new ResponseError(404, "Merchant not found");
                }

                const dataProduct = {
                    merchantId: merchant.id.toString(),
                    ...productRequest,
                }
                const newProduct = await productRepository.createProduct(dataProduct, prismaTransaction);
                return newProduct
            });
            return newProduct;
        } catch (error) {
            console.log(`Registration product failed: ${error.message}`);
            throw new ResponseError(500, "Internal Server Error");
        }
    }
    
    async getById({ params }) {
        return await this.findProductById(params.id);
    }

    async updateById({ params, body }) {
        const productRequest = validate(productValidation, body);
        const product = await this.findProductById(params.id);
        return await productRepository.updateProductById(product.id, productRequest);
    }

    async deleteById({ params }) {
        const product =  await this.findProductById(params.id);
        const { name } = await productRepository.deleteById(product.id);
        return `product ${name} berhasil dihapus`
    }

    async findProductById(id) {
        const product = await productRepository.findProductById(id)
        if (!product) {
            throw new ResponseError(404, `\"product\" not found`);
        }
        return product
    }
    
}

export const productService = new ProductService();