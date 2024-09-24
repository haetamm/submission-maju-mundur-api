import { prismaClient } from "../application/database.js";

class TransactionRepository {
    
    async createTransaction(customerId, prismaTransaction) {
        return prismaTransaction.transaction.create({
            data: {
                customerId,
                transDate: new Date(),
            },
        });;
    }

    async findTransactionsByProductIds(productIds) {
        return prismaClient.transaction.findMany({
            where: {
                details: {
                    some: {
                        productId: { in: productIds }
                    }
                }
            },
            include: {
                details: {
                    include: {
                        product: true 
                    }
                }
            }
        });
    }
    
    
    
}

export const transactionRepository = new TransactionRepository();
