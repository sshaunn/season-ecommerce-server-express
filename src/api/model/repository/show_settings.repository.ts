import BaseRepository from "./Base.Repository";
import ShowSettings from "../entity/show_settings.entity";
import { dataSource } from "../data-source";
import { FindManyOptions, FindOneOptions, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const showSetRepo = new BaseRepository(ShowSettings, dataSource);

export const showSetFind = async (
  options?: FindManyOptions<ShowSettings> | undefined
): Promise<ShowSettings[]> => {
  return await showSetRepo.find(options);
};

export const showSetFindOne = async (
  options: FindOneOptions<ShowSettings>
): Promise<ShowSettings | null> => {
  return await showSetRepo.findOne(options);
};

export const showsetUpdateById = async (
  id: string,
  updateData: QueryDeepPartialEntity<ShowSettings>
): Promise<UpdateResult> => {
  return await showSetRepo.update(id, updateData);
};
