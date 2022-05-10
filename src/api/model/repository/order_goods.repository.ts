import { FindManyOptions, FindOptionsWhere, InsertResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import OrderGoods from "../entity/order_goods.entity";
import BaseRepository from "./Base.Repository";

const orderGoodsRepo = new BaseRepository(OrderGoods, dataSource);

export const orderGoodsFind = async (
  options: FindManyOptions<OrderGoods> | undefined
): Promise<OrderGoods[]> => {
  return await orderGoodsRepo.find(options);
};

export const orderGoodsFindBy = async (
  whereClause: FindOptionsWhere<OrderGoods> | FindOptionsWhere<OrderGoods>[]
): Promise<OrderGoods[]> => {
  return await orderGoodsRepo.findBy(whereClause);
};

export const orderGoodsInsert = async (
  insertData: QueryDeepPartialEntity<OrderGoods> | QueryDeepPartialEntity<OrderGoods>[]
): Promise<InsertResult> => {
  return await orderGoodsRepo.insert(insertData);
};
