import { prismaClient } from "../application/database.js";

class MerchantRepository {

    async createMerchant(userData, prismaTransaction) {
        return prismaTransaction.merchant.create({
            data: userData,
        });
    }

    async findMerchantByUserId(userId, prismaTransaction) {
            return prismaTransaction.merchant.findFirst({
                where: { userId },
            });
            
    }

    async getMerchantByUserId(userId) {
        return prismaClient.merchant.findFirst({
            where: { userId },
        });
        
    }
    
}

export const merchantRepository = new MerchantRepository();
