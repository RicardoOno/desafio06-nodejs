import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    const transRepo = getCustomRepository(TransactionsRepository);
    const findTransaction = await transRepo.findOne(id);

    if (!findTransaction) {
      throw new AppError('Invalid id');
    }

    await transRepo.remove(findTransaction);
  }
}

export default DeleteTransactionService;
