import { In, getRepository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface ResponseCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    // TODO
    const fileReadStream = fs.createReadStream(path);

    const parser = csvParse({
      from_line: 2,
    });

    const transactions: ResponseCSV[] = [];
    const categories: string[] = [];

    const parseCsv = fileReadStream.pipe(parser);

    // parseCvs.on naturalmente nao é sincrono
    parseCsv.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCsv.on('end', resolve));

    const categoryRepo = getRepository(Category);
    const existsCategory = await categoryRepo.find({
      where: { title: In(categories) },
    });

    const existsCategoryTitle = existsCategory.map((c: Category) => c.title);

    // retira duplicação de categoroas
    const addCategory = categories
      .filter(c => !existsCategoryTitle.includes(c))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = await categoryRepo.create(
      addCategory.map(title => ({
        title,
      })),
    );

    await categoryRepo.save(newCategories);

    const finalCategories = [...newCategories, ...existsCategory];
    console.log(finalCategories);

    const transRepo = getRepository(Transaction);
    const createdTrans = transRepo.create(
      transactions.map(t => ({
        title: t.title,
        type: t.type,
        value: t.value,
        category: finalCategories.find(c => c.title === t.category),
      })),
    );

    await transRepo.save(createdTrans);

    await fs.promises.unlink(path);

    return createdTrans;
  }
}

export default ImportTransactionsService;
