import { FindManyOptions, FindOptionsWhere, InsertResult, ObjectID } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import Footprint from "../entity/footprint.entity";
import BaseRepository from "./Base.Repository";

const footprintRepo = new BaseRepository(Footprint, dataSource);

export const footprintFindAndCount = async (
  options: FindManyOptions<Footprint> | undefined
): Promise<[Footprint[], number]> => {
  return await footprintRepo.findAndCount(options);
};

export const footprintCount = async (
  options: FindManyOptions<Footprint> | undefined
): Promise<number> => {
  return await footprintRepo.count(options);
};

export const footprintInsert = async (
  insertData: QueryDeepPartialEntity<Footprint> | QueryDeepPartialEntity<Footprint>[]
): Promise<InsertResult> => {
  return await footprintRepo.insert(insertData);
};

export const footprintFind = async (options: FindManyOptions<Footprint>) => {
  return await footprintRepo
    .createQueryBuilder("fp")
    .leftJoinAndSelect("fp.goods", "goods")
    .select(["goods.*", "fp.*"])
    .setFindOptions(options)
    .getRawMany();
};

export const footprintDelete = async (
  conditions:
    | string
    | number
    | string[]
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
    | FindOptionsWhere<Footprint>
) => {
  return await footprintRepo.delete(conditions);
};
