import { FindManyOptions, FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import PickupPoint from "../entity/pickup_point.entity";
import BaseRepository from "./Base.Repository";

const pickRepo = new BaseRepository(PickupPoint, dataSource);

export const pickupInsert = async (
  insertData: QueryDeepPartialEntity<PickupPoint> | QueryDeepPartialEntity<PickupPoint>[]
) => {
  return await pickRepo.insert(insertData);
};

export const pickupUpdateById = async (
  id: string | number,
  updateData: QueryDeepPartialEntity<PickupPoint>
) => {
  return await pickRepo.update(id, updateData);
};

export const pickupFind = async (options: FindManyOptions<PickupPoint> | undefined) => {
  return await pickRepo.find(options);
};

export const pickupFindOneBy = async (
  whereClause: FindOptionsWhere<PickupPoint> | FindOptionsWhere<PickupPoint>[]
): Promise<PickupPoint | null> => {
  return await pickRepo.findOneBy(whereClause);
};
