import { Router } from 'express';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import CreateCategoryService from '../services/CreateCategoryService';

import uploadConfig from '../config/multer';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = new TransactionsRepository();
  const res = await transactionsRepository.getAll();

  const result = res.map(r => {
    delete r.created_at;
    delete r.updated_at;
    delete r.category_id;
    delete r.categories.created_at;
    delete r.categories.updated_at;
    return r;
  });

  const finalResult = {
    transactions: result,
    balance: await transactionsRepository.getBalance(),
  };

  return response.json(finalResult);
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  try {
    const { title, value, type, category } = request.body;

    const transactionsService = new CreateTransactionService();
    const transaction = await transactionsService.execute({
      title,
      value,
      type,
      category,
    });

    return response.json(transaction);
  } catch (e) {
    return response.status(400).json({ message: 'error', status: 'error' });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;

  const deleteService = new DeleteTransactionService();

  await deleteService.execute(id);

  return response.status(201).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    const { file } = request;

    const importService = new ImportTransactionsService();

    const importResult = await importService.execute(file);

    console.log(importResult);

    return response.json(importResult);
  },
);

export default transactionsRouter;
