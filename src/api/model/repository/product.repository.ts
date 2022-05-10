import {
  Brackets,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  SelectQueryBuilder,
  UpdateQueryBuilder,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import Product from "../entity/product.entity";
import BaseRepository from "./Base.Repository";

const productRepo = new BaseRepository(Product, dataSource);

export const productUpdate = async (
  id: string,
  updateData: QueryDeepPartialEntity<Product>
): Promise<UpdateResult> => {
  return await productRepo.update(id, updateData);
};

export const productUpdateById = async (
  updateData: QueryDeepPartialEntity<Product>,
  where:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: UpdateQueryBuilder<Product>) => string)
) => {
  return await productRepo.createQueryBuilder().update().set(updateData).where(where).execute();
};

export const productFindOne = async (options: FindOneOptions<Product>): Promise<Product | null> => {
  return await productRepo.findOne(options);
};

export const productFindOneBy = async (
  whereClause: FindOptionsWhere<Product> | FindOptionsWhere<Product>[]
): Promise<Product | null> => {
  return await productRepo.findOneBy(whereClause);
};

export const productSum = async (
  column: string,
  options:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: SelectQueryBuilder<Product>) => string)
) => {
  const { sum } = await productRepo
    .createQueryBuilder()
    .select(`SUM(${column})`, "sum")
    .where(options)
    .getRawOne();
  return sum;
};

export const productInsert = async (
  insertData: QueryDeepPartialEntity<Product> | QueryDeepPartialEntity<Product>[]
) => {
  return await productRepo.insert(insertData);
};

export const productFind = async (options: FindManyOptions<Product> | undefined) => {
  return await productRepo.find(options);
};

export const productFindBy = async (
  whereClause: FindOptionsWhere<Product> | FindOptionsWhere<Product>[]
) => {
  return await productRepo.findBy(whereClause);
};

/**
 * ,
        {
            "goods_sn": "3322122",
            "value": "sda",
            "cost": "3",
            "retail_price": "2",
            "goods_weight": "2",
            "goods_number": "1",
            "goods_name": "asdasd"
        }
 */
