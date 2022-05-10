import { FindManyOptions, FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import Address from "../entity/address.entity";
import BaseRepository from "./Base.Repository";

const addressRepo = new BaseRepository(Address, dataSource);

export const addressCountBy = async (
  where: FindOptionsWhere<Address> | FindOptionsWhere<Address>[]
): Promise<number> => {
  return await addressRepo.countBy(where);
};

export const addressFindBy = async (
  options: FindOptionsWhere<Address> | FindOptionsWhere<Address>[]
): Promise<Address[]> => {
  return await addressRepo.findBy(options);
};

export const addressFind = async (
  options: FindManyOptions<Address> | undefined
): Promise<Address[]> => {
  return await addressRepo.find(options);
};

export const addressFindAndCount = async (
  options: FindManyOptions<Address> | undefined
): Promise<[Address[], number]> => {
  return await addressRepo.findAndCount(options);
};

export const addressUpdate = async (id: string, updateData: QueryDeepPartialEntity<Address>) => {
  return await addressRepo.update(id, updateData);
};
