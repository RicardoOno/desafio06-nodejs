// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';

import Transactions from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    const transactionsRepository = getRepository(Transactions);

    const findTransaction = await transactionsRepository.findOne(id);

    if (!findTransaction) {
      throw new Error('Invalid params');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
