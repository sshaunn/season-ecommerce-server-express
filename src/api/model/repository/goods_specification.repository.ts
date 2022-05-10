import GoodsSpecification from "../entity/goods_specification.entity";
import { dataSource } from "../data-source";
import BaseRepository from "./Base.Repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import {
  Brackets,
  FindManyOptions,
  FindOptionsWhere,
  ObjectID,
  ObjectLiteral,
  UpdateQueryBuilder,
} from "typeorm";

const goodsSpecificationRepo = new BaseRepository(GoodsSpecification, dataSource);

export const goodsSpecificationUpdate = async (
  critera:
    | string
    | number
    | string[]
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
    | FindOptionsWhere<GoodsSpecification>,
  updateData: QueryDeepPartialEntity<GoodsSpecification>
) => {
  return await goodsSpecificationRepo.update(critera, updateData);
};

export const goodsSpecificationFind = async (
  options: FindManyOptions<GoodsSpecification> | undefined
): Promise<GoodsSpecification[]> => {
  return await goodsSpecificationRepo.find(options);
};

export const goodsSpecificationUpdateById = async (
  updateData: QueryDeepPartialEntity<GoodsSpecification>,
  where:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: UpdateQueryBuilder<GoodsSpecification>) => string)
) => {
  return await goodsSpecificationRepo
    .createQueryBuilder()
    .update()
    .set(updateData)
    .where(where)
    .execute();
};

export const goodsSpecificationInsert = async (
  insertData:
    | QueryDeepPartialEntity<GoodsSpecification>
    | QueryDeepPartialEntity<GoodsSpecification>[]
) => {
  return await goodsSpecificationRepo.insert(insertData);
};
