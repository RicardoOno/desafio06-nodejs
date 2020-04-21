import csv2json from 'csvtojson';
import { getRepository } from 'typeorm';

import Transactions from '../models/Transaction';
import Category from '../models/Category';

import CreateTransactionService from './CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  path: string;
}

class ImportTransactionsService {
  public async execute({ path }: Request): Promise<Transactions[]> {
    // TODO
    const results = await csv2json().fromFile(path);
    console.log(results);

    const transactionService = new CreateTransactionService();

    let count = 0;
    const transactions: Transactions[] = [];
    while (results.length > count) {
      transactions.push(
        // eslint-disable-next-line no-await-in-loop
        await transactionService.execute({
          title: results[count].title,
          type: results[count].type,
          value: results[count].value,
          category: results[count].category,
        }),
      );
      // eslint-disable-next-line no-plusplus
      count++;
    }
    return transactions;
  }
}

export default ImportTransactionsService;
