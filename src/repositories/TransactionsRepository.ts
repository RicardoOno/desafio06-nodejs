import { EntityRepository, getRepository } from 'typeorm';

import Transactions from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transactions)
class TransactionsRepository {
  public async getAll(): Promise<Transactions[]> {
    const transactionsRepository = getRepository(Transactions);
    const transactions = await transactionsRepository.find({
      relations: ['categories'],
    });
    return transactions;
  }

  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transactions);
    const transactions = await transactionsRepository.find();

    const income = transactions.reduce((total, actual) => {
      if (actual.type === 'income') return total + actual.value;
      return total;
    }, 0);

    const outcome = transactions.reduce((total, actual) => {
      if (actual.type === 'outcome') return total + actual.value;
      return total;
    }, 0);

    const balance = { income, outcome, total: income - outcome };

    return balance;
  }
}

export default TransactionsRepository;
