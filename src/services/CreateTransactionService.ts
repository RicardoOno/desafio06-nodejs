import {
  getCustomRepository,
  getRepository,
  TransactionRepository,
} from 'typeorm';

// import AppError from '../errors/AppError';
import TransactionsRepositoru from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepositoru);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total - value < 0) {
      throw new AppError('You do not have  enough balance', 400);
    }

    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
