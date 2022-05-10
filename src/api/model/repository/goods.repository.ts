import Goods from "../entity/goods.entity";
import { dataSource } from "../data-source";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  UpdateResult,
} from "typeorm";
import BaseRepository from "./Base.Repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const goodsRepo = new BaseRepository(Goods, dataSource);

export const goodsQueryRunner = dataSource.createQueryRunner();

export const goodsCount = async (options?: FindManyOptions<Goods> | undefined): Promise<number> => {
  return await goodsRepo.count(options);
};

export const goodsFind = async (options: FindManyOptions<Goods> | undefined): Promise<Goods[]> => {
  return await goodsRepo.find(options);
};

export const goodsFindBy = async (
  whereClause: FindOptionsWhere<Goods> | FindOptionsWhere<Goods>[]
) => {
  return await goodsRepo.findBy(whereClause);
};

export const goodsFindOne = async (options: FindOneOptions<Goods>): Promise<Goods | null> => {
  return await goodsRepo.findOne(options);
};

export const goodsFindAndCount = async (
  options: FindManyOptions<Goods> | undefined
): Promise<[Goods[], number]> => {
  return await goodsRepo.findAndCount(options);
};

export const goodsUpdate = async (
  id: string | number,
  updateData: QueryDeepPartialEntity<Goods>
): Promise<UpdateResult> => {
  return await goodsRepo.update(id, updateData);
};

export const goodsInsert = async (
  insertData: QueryDeepPartialEntity<Goods> | QueryDeepPartialEntity<Goods>[]
): Promise<InsertResult> => {
  return await goodsRepo.insert(insertData);
};
