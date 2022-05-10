import BaseRepository from "./Base.Repository";
import { dataSource } from "../data-source";
import Ad from "../entity/ad.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const adRepo = new BaseRepository(Ad, dataSource);

export const adFindAndCount = async (options?: FindManyOptions<Ad> | undefined) => {
  return await adRepo.findAndCount(options);
};

export const adUpdateById = async (id: string | number, updateData: QueryDeepPartialEntity<Ad>) => {
  return await adRepo.update(id, updateData);
};

export const adFindOne = async (options: FindOneOptions<Ad>) => {
  return await adRepo.findOne(options);
};

export const adFind = async (options?: FindManyOptions<Ad> | undefined) => {
  return await adRepo.find(options);
};

export const adInsert = async (
  insertData: QueryDeepPartialEntity<Ad> | QueryDeepPartialEntity<Ad>[]
) => {
  return await adRepo.insert(insertData);
};
