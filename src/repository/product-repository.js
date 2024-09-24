import { prismaClient } from "../application/database.js";

class ProductRepository {
    
    async createProduct(data) {
        return prismaClient.product.create({
            data,
        });
    }

    async getAllProduct() {
        return prismaClient.product.findMany({
            where: { deletedAt: null }
        })
    }

    async updateProductById(id, data) {
        return prismaClient.product.update({
            where: { id },
            data: data,
        })
    }

    async findProductById(id) {
        return prismaClient.product.findFirst({
            where: { id, deletedAt: null },
        })
    }

    async deleteById(id) {
        return prismaClient.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async findProductsByMerchantId(merchantId) {
        return await prismaClient.product.findMany({
            where: { merchantId: merchantId },
        });
    }

    
}

export const productRepository = new ProductRepository();
