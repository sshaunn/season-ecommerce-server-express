import Category from "../entity/category.entity";
import { dataSource } from "../data-source";
import BaseRepository from "./Base.Repository";
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectID,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

// export const categoryRepository = dataSource.getRepository(Category);

class CategoryRepository {
  public static findById = async (id: number): Promise<Category | null> => {
    const categoryRepository = dataSource.getRepository<Category>(Category);
    const category = await categoryRepository.findOneBy({ id: id });
    return category;
  };

  public static update = async (id: number, updateDate: Object): Promise<void> => {
    const categoryRepository = dataSource.getRepository<Category>(Category);
    await categoryRepository.update(id, updateDate);
  };

  public static getAll = async (findOptions: Object): Promise<Category[]> => {
    const categoryRepository = dataSource.getRepository<Category>(Category);
    const categoryList = await categoryRepository.find(findOptions);
    return categoryList;
  };

  /**
   * Override
   * save() method, save the entity sent from url into database, insert if not exist,, otherwise update
   *
   * @param entity Object sent from front end and run getRepository().save()
   *
   */
  public static save = async (entity: Object): Promise<void> => {
    const categoryRepository = dataSource.getRepository<Category>(Category);
    await categoryRepository.save(entity);
  };

  public static categoryRepository = dataSource.getRepository(Category);
}

const categoryRepo = new BaseRepository(Category, dataSource);

export const categoryFindOne = async (
  options: FindOneOptions<Category>
): Promise<Category | null> => {
  return await categoryRepo.findOne(options);
};

export const categoryFind = async (options: FindManyOptions<Category> | undefined) => {
  return await categoryRepo.find(options);
};

export const categoryFindBy = async (
  whereClause: FindOptionsWhere<Category> | FindOptionsWhere<Category>[]
): Promise<Category[]> => {
  return await categoryRepo.findBy(whereClause);
};

// export const categoryFindPartial = async () => {
//   return await categoryRepo
//     .createQueryBuilder()
//     .orderBy(['sort_order', 'ASC'])
//     .select(["id", "img_url AS banner", "name", "p_height AS height", "goods AS goodsList"])
//     .relation("goods")
//     .;
// };

export const categoryDelete = async (
  id:
    | string
    | number
    | string[]
    | FindOptionsWhere<Category>
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
): Promise<DeleteResult> => {
  return await categoryRepo.delete(id);
};

export const categoryUpdateById = async (
  id:
    | string
    | number
    | string[]
    | FindOptionsWhere<Category>
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[],
  updateData: QueryDeepPartialEntity<Category>
): Promise<UpdateResult> => {
  return await categoryRepo.update(id, updateData);
};

export default CategoryRepository;
