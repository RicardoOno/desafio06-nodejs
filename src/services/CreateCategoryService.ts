// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Category from '../models/Category';

class CreateCategoryService {
  public async execute(category: string): Promise<string> {
    // TODO
    const categoriesRepository = getRepository(Category);

    const foundCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (foundCategory) return foundCategory.id;

    const newCategory = categoriesRepository.create({
      title: category,
    });

    await categoriesRepository.save(newCategory);

    console.log(newCategory);

    return newCategory.id;
  }
}

export default CreateCategoryService;
