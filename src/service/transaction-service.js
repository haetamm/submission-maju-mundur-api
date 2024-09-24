
import {productRepository} from '../repository/product-repository.js';
import { prismaClient } from "../application/database.js";
import { validate } from '../validation/validation.js';
import { ResponseError } from '../entities/response-error.js';
import { transactionValidation } from '../validation/transaction-validation.js';
import { transactionRepository } from '../repository/transaction-repository.js';
import { transactionDetailRepository } from '../repository/transaction-detail-respository.js';
import { customerRepository } from '../repository/customer-repository.js';
import { userService } from './user-service.js';
import { merchantRepository } from '../repository/merchant-repository.js';

class TransactionService {

    async createTransaction({ body, user }) {
        const { product } = validate(transactionValidation, body);
        let totalPrice = 0;
    
        try {
            const newTransaction = await prismaClient.$transaction(async (prismaTransaction) => {
                const { customers } = await userService.findUserById(user.id);
                if (!customers || customers.length === 0) {
                    throw new ResponseError(404, "Customer not found.");
                }
                const transaction = await transactionRepository.createTransaction(customers[0].id, prismaTransaction);
    
                for (const detail of product) {
                    const { quantity, price, productId } = detail;
                    const productResult = await productRepository.findProductById(productId);
    
                    if (!productResult) {
                        throw new ResponseError(404, `"productId" product not found`);
                    }
    
                    if (productResult.price !== price) {
                        throw new ResponseError(400, `"price" product mismatch!`);
                    }
    
                    if (quantity <= 0 || quantity > productResult.stock) {
                        throw new ResponseError(400, `"quantity" Invalid quantity!`);
                    }
    
                    await productRepository.updateProductById(productResult.id, { stock: productResult.stock - quantity }, prismaTransaction);
    
                    const dataDetailTransaction = {
                        qty: quantity,
                        price: price,
                        productId: productId,
                        transactionId: transaction.id,
                    };
                    await transactionDetailRepository.createTransactionDetail(dataDetailTransaction, prismaTransaction);
    
                    totalPrice += quantity * price;
                }
    
                const pointEarned = Math.floor(totalPrice / 1000);
                await customerRepository.updatePointTransaction(customers[0].id, customers[0].pointTransaction + pointEarned, prismaTransaction);
    
                return {
                    id: transaction.id,
                    transaction_date: transaction.trans_date,
                    pointEarned: pointEarned,
                    customer: customers[0], 
                    total_transaction: totalPrice,
                    details: transaction.transactionDetails, 
                };
            });
    
            return newTransaction;
        } catch (error) {
            if (error instanceof ResponseError) {
                throw error;
            } else {
                console.log(`Registration product failed: ${error.message}`);
                throw new ResponseError(500, "Internal Server Error");
            }
        }
    }
    
    
    async getCustomerHistoryTransaction({ user }) {
        try {
            const merchant = await merchantRepository.getMerchantByUserId(user.id);
            if (!merchant) {
                throw new Error("Merchant not found for this user");
            }
    
            const products = await productRepository.findProductsByMerchantId(merchant.id);
            if (!products.length) return [];
    
            const transactions = await transactionRepository.findTransactionsByProductIds(products.map(p => p.id));
    
            const customerIds = new Set(transactions.map(transaction => transaction.customerId));
    
            const customers = await customerRepository.findCustomersByIds(Array.from(customerIds));
    
            return await this.mapCustomersToPurchaseHistory(customers, transactions);
        } catch (error) {
            console.log(`Fetching customer transaction history failed: ${error.message}`);
            throw new ResponseError(500, "Internal Server Error");
        }
    }
    
    async mapCustomersToPurchaseHistory(customers, transactions) {
        return customers.map(customer => {
            const customerTransactions = transactions.filter(transaction => transaction.customerId === customer.id);
    
            const purchasedProducts = customerTransactions.map(transaction => ({
                transactionId: transaction.id,
                transactionDate: transaction.transDate,
                products: transaction.details.map(detail => ({
                    productId: detail.productId,
                    quantity: detail.qty,
                    price: detail.price
                }))
            }));
    
            return {
                customer,
                purchaseHistory: purchasedProducts
            };
        });
    }

}

export const transactionService = new TransactionService();