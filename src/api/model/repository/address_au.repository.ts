import {
  Brackets,
  FindManyOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectLiteral,
  UpdateQueryBuilder,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import AddressAU from "../entity/address_au.entity";
import BaseRepository from "./Base.Repository";

const addressRepo = new BaseRepository(AddressAU, dataSource);

export const addressAUCountBy = async (
  where: FindOptionsWhere<AddressAU> | FindOptionsWhere<AddressAU>[]
): Promise<number> => {
  return await addressRepo.countBy(where);
};

export const addressAUFindBy = async (
  options: FindOptionsWhere<AddressAU> | FindOptionsWhere<AddressAU>[]
): Promise<AddressAU[]> => {
  return await addressRepo.findBy(options);
};

export const addressAUFind = async (
  options: FindManyOptions<AddressAU> | undefined
): Promise<AddressAU[]> => {
  return await addressRepo.find(options);
};

export const addressAUFindOneBy = async (
  whereClause: FindOptionsWhere<AddressAU> | FindOptionsWhere<AddressAU>[]
): Promise<AddressAU | null> => {
  return await addressRepo.findOneBy(whereClause);
};

export const addressAUFindOneOrFailBy = async (
  whereClause: FindOptionsWhere<AddressAU> | FindOptionsWhere<AddressAU>[]
): Promise<AddressAU> => {
  return await addressRepo.findOneByOrFail(whereClause);
};

export const addressAUFindAndCount = async (
  options: FindManyOptions<AddressAU> | undefined
): Promise<[AddressAU[], number]> => {
  return await addressRepo.findAndCount(options);
};

export const addressAUUpdate = async (
  id: string,
  updateData: QueryDeepPartialEntity<AddressAU>
) => {
  return await addressRepo.update(id, updateData);
};

export const addressAUInsert = async (
  insertData: QueryDeepPartialEntity<AddressAU> | QueryDeepPartialEntity<AddressAU>[]
): Promise<InsertResult> => {
  return await addressRepo.insert(insertData);
};

export const addressAUUpdateBy = async (
  updateData: QueryDeepPartialEntity<AddressAU>,
  whereClause:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: UpdateQueryBuilder<AddressAU>) => string)
) => {
  return await addressRepo
    .createQueryBuilder()
    .update()
    .set(updateData)
    .where(whereClause)
    .execute();
};
