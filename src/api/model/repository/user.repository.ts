import User from "../entity/user.entity";
import { dataSource } from "../data-source";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, ObjectID } from "typeorm";
import BaseRepository from "./Base.Repository";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UpsertOptions } from "typeorm/repository/UpsertOptions";

const userRepo = new BaseRepository(User, dataSource);

export const usersCount = async (options?: FindManyOptions<User>): Promise<number> => {
  return await userRepo.count(options);
};

export const userFind = async (options: FindManyOptions<User> | undefined): Promise<User[]> => {
  return await userRepo.find(options);
};

export const userFindBy = async (
  options: FindOptionsWhere<User> | FindOptionsWhere<User>[]
): Promise<User[]> => {
  return await userRepo.findBy(options);
};

export const userFindOne = async (options: FindOneOptions<User>): Promise<User | null> => {
  return await userRepo.findOne(options);
};

export const userFindOneBy = async (
  option: FindOptionsWhere<User> | FindOptionsWhere<User>[]
): Promise<User | null> => {
  return await userRepo.findOneBy(option);
};

export const update = async (
  id: string | number,
  updateData: QueryDeepPartialEntity<User>
): Promise<void> => {
  await userRepo.update(id, updateData);
};

export const userUpsert = async (
  upsertData: QueryDeepPartialEntity<User> | QueryDeepPartialEntity<User>[],
  conflict: string[] | UpsertOptions<User>
) => {
  return await userRepo.upsert(upsertData, conflict);
};

export const userInsert = async (
  insertData: QueryDeepPartialEntity<User> | QueryDeepPartialEntity<User>[]
): Promise<InsertResult> => {
  return await userRepo.insert(insertData);
};

export const userUpdate = async (
  id:
    | string
    | number
    | string[]
    | FindOptionsWhere<User>
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[],
  updateData: QueryDeepPartialEntity<User>
) => {
  return await userRepo.update(id, updateData);
};
