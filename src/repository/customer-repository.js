import { prismaClient } from "../application/database.js";

class CustomerRepository {

    async createCustomer(userData, prismaTransaction) {
        return prismaTransaction.customer.create({
            data: userData,
        });
    }

    async updatePointTransaction(customerId, newPoints, prismaTransaction) {
        return await prismaTransaction.customer.update({
            where: { id: customerId },
            data: { pointTransaction: newPoints },
        });
    }

    async findCustomersByIds(customerIds) {
        return await prismaClient.customer.findMany({
            where: { id: { in: customerIds } },
        });
    }
}

export const customerRepository = new CustomerRepository();
