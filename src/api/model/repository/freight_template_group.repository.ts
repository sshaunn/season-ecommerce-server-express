import { FindOptionsWhere, InsertResult, ObjectID } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import FreightTemplateGroup from "../entity/freight_template_group.entity";
import BaseRepository from "./Base.Repository";

const freightGroupRepo = new BaseRepository(FreightTemplateGroup, dataSource);

export const freightTemplateGroupInsert = async (
  insertData: QueryDeepPartialEntity<unknown> | QueryDeepPartialEntity<unknown>[]
): Promise<InsertResult> => {
  return await freightGroupRepo.insert(insertData);
};

export const freightTemplateGroupFindBy = async (
  whereClause: FindOptionsWhere<FreightTemplateGroup> | FindOptionsWhere<FreightTemplateGroup>[]
): Promise<FreightTemplateGroup[]> => {
  return await freightGroupRepo.findBy(whereClause);
};

export const freightTemplateGroupUpdate = async (
  critera:
    | string
    | number
    | string[]
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
    | FindOptionsWhere<FreightTemplateGroup>,
  updateData: QueryDeepPartialEntity<FreightTemplateGroup>
) => {
  return await freightGroupRepo.update(critera, updateData);
};
