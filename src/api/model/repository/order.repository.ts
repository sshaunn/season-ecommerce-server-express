import Order from "../entity/order.entity";
import { dataSource } from "../data-source";
import {
  Brackets,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm";
import BaseRepository from "./Base.Repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const orderRepo = new BaseRepository(Order, dataSource);
export const orderSumBy = async (
  options:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: SelectQueryBuilder<Order>) => string)
) => {
  const { sum } = await orderRepo
    .createQueryBuilder()
    .select("SUM(actual_price)", "sum")
    .where(options)
    .getRawOne();
  return sum;
};
export const orderCount = async (options?: FindManyOptions<Order> | undefined): Promise<number> => {
  return await orderRepo.count(options);
};
export const orderCountBy = async (
  options: FindOptionsWhere<Order> | FindOptionsWhere<Order>[]
) => {
  return await orderRepo.countBy(options);
};

export const orderFindAndCount = async (
  options: FindManyOptions<Order> | undefined
): Promise<[Order[], number]> => {
  return await orderRepo.findAndCount(options);
};

export const orderUpdate = async (id: string, updateData: QueryDeepPartialEntity<Order>) => {
  return await orderRepo.update(id, updateData);
};

export const orderFind = async (options: FindManyOptions<Order> | undefined): Promise<Order[]> => {
  return await orderRepo.find(options);
};

export const orderFindBy = async (
  where: FindOptionsWhere<Order> | FindOptionsWhere<Order>[]
): Promise<Order[]> => {
  return await orderRepo.findBy(where);
};
