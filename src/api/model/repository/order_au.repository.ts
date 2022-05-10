import { dataSource } from "../data-source";
import BaseRepository from "./Base.Repository";
import OrderAU from "../entity/order_au.entity";
import {
  Brackets,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectLiteral,
  SaveOptions,
  UpdateQueryBuilder,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const orderAURepo = new BaseRepository(OrderAU, dataSource);

export const orderAUFind = async (
  options: FindManyOptions<OrderAU> | undefined
): Promise<OrderAU[]> => {
  return await orderAURepo.find(options);
};

export const orderAUFindAndCount = async (
  options: FindManyOptions<OrderAU> | undefined
): Promise<[OrderAU[], number]> => {
  return await orderAURepo.findAndCount(options);
};

export const orderAUCount = async (
  options: FindManyOptions<OrderAU> | undefined
): Promise<number> => {
  return await orderAURepo.count(options);
};

export const orderAUFindOne = async (options: FindOneOptions<OrderAU>): Promise<OrderAU | null> => {
  return await orderAURepo.findOne(options);
};

export const orderAUFindOneByOrFail = async (
  whereClause: FindOptionsWhere<OrderAU> | FindOptionsWhere<OrderAU>[]
): Promise<OrderAU> => {
  return await orderAURepo.findOneByOrFail(whereClause);
};

export const orderAUFindOneBy = async (
  options: FindOptionsWhere<OrderAU> | FindOptionsWhere<OrderAU>[]
): Promise<OrderAU | null> => {
  return await orderAURepo.findOneBy(options);
};

export const orderAUInsert = async (
  insertData: QueryDeepPartialEntity<OrderAU> | QueryDeepPartialEntity<OrderAU>[]
): Promise<InsertResult> => {
  return await orderAURepo.insert(insertData);
};

export const orderAUUpdateById = async (
  id: string | number,
  updateData: QueryDeepPartialEntity<OrderAU>
): Promise<UpdateResult> => {
  return await orderAURepo.update(id, updateData);
};

export const orderAUUpdateSave = async (
  entity: any
  //   updateData: SaveOptions & { reload: false }
) => {
  return await orderAURepo.save(entity);
};

export const orderAUUpdate = async (
  updateData: QueryDeepPartialEntity<OrderAU>,
  whereClause:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: UpdateQueryBuilder<OrderAU>) => string)
) => {
  return await orderAURepo
    .createQueryBuilder()
    .update()
    .set(updateData)
    .where(whereClause)
    .execute();
};

export const orderAUUpdateAndReturn = async (
  id: string | number,
  updateData: QueryDeepPartialEntity<OrderAU>
) => {
  return await orderAURepo
    .createQueryBuilder()
    .update(OrderAU)
    .set(updateData)
    .where("id = :id", { id: id })
    .execute();
};
