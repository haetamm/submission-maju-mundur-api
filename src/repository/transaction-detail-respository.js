class TransactionDetailRepository {
    
    async createTransactionDetail(data, prismaTransaction) {
        return prismaTransaction.transactionDetail.create({
            data,
        });
    }

}

export const transactionDetailRepository = new TransactionDetailRepository();
