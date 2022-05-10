import Specification from "../entity/specification.entity";
import { dataSource } from "../data-source";
import BaseRepository from "./Base.Repository";
import { FindManyOptions, FindOneOptions, InsertResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const specRepo = new BaseRepository(Specification, dataSource);

export const specificationFind = async (
  options: FindManyOptions<Specification> | undefined
): Promise<Specification[]> => {
  return await specRepo.find(options);
};

export const specificationFindOne = async (
  options: FindOneOptions<Specification>
): Promise<Specification | null> => {
  return await specRepo.findOne(options);
};

export const specificationInsert = async (
  insertData: QueryDeepPartialEntity<Specification> | QueryDeepPartialEntity<Specification>[]
): Promise<InsertResult> => {
  return await specRepo.insert(insertData);
};
class SpecificationRepository {
  public static findById = async (id: number): Promise<Specification | null> => {
    const specificationRepository = dataSource.getRepository<Specification>(Specification);
    const specification = await specificationRepository.findOneBy({ id: id });
    return specification;
  };

  public static update = async (id: number, updateDate: Object): Promise<void> => {
    const specificationRepository = dataSource.getRepository<Specification>(Specification);
    await specificationRepository.update(id, updateDate);
  };

  public static delete = async (id: number): Promise<void> => {
    const specificationRepository = dataSource.getRepository(Specification);
    await specificationRepository.delete(id);
  };

  public static getAll = async (options: Object): Promise<Specification[]> => {
    const specificationRepository = dataSource.getRepository<Specification>(Specification);
    return await specificationRepository.find(options);
  };
}
export default SpecificationRepository;
