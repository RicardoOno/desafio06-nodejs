// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO

    const categoriesService = new CreateCategoryService();
    const category_id = await categoriesService.execute(category);

    const transactionsRepository = getRepository(Transaction);

    if (type !== 'income' && type !== 'outcome') {
      throw new Error('Invalid type');
    }
    const transRepo = new TransactionsRepository();
    if (type === 'outcome') {
      const { total } = await transRepo.getBalance();
      if (total - value < 0) {
        throw new Error('No cash');
      }
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
