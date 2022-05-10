import Settings from "../entity/setting.entity";
import { dataSource } from "../data-source";
import { FindManyOptions, FindOneOptions } from "typeorm";
import BaseRepository from "./Base.Repository";

const settingRepo = new BaseRepository(Settings, dataSource);

export const settingFindOne = async (
  options: FindManyOptions<Settings>
): Promise<Settings | null> => {
  return await settingRepo.findOne(options);
};
