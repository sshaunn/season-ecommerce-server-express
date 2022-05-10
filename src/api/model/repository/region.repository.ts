import { FindOneOptions, FindOptionsWhere } from "typeorm";
import { dataSource } from "../data-source";
import Region from "../entity/region.entity";
import BaseRepository from "./Base.Repository";

const regionRepo = new BaseRepository(Region, dataSource);

export const regionFindOne = async (options: FindOneOptions<Region>): Promise<Region | null> => {
  return await regionRepo.findOne(options);
};

export const regionFindBy = async (
  where: FindOptionsWhere<Region> | FindOptionsWhere<Region>[]
): Promise<Region[]> => {
  return await regionRepo.findBy(where);
};
