import BaseRepository from "./Base.Repository";
import { dataSource } from "../data-source";
import FreightTemplateDetail from "../entity/freight_template_detail.entity";
import { FindOptionsWhere, InsertResult, ObjectID } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const freightDetailRepo = new BaseRepository(FreightTemplateDetail, dataSource);

export const freightDetailInsert = async (
  insertData:
    | QueryDeepPartialEntity<FreightTemplateDetail>
    | QueryDeepPartialEntity<FreightTemplateDetail>[]
): Promise<InsertResult> => {
  return await freightDetailRepo.insert(insertData);
};

export const freightDetailUpdate = async (
  critera:
    | string
    | number
    | string[]
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
    | FindOptionsWhere<FreightTemplateDetail>,
  updateData: QueryDeepPartialEntity<FreightTemplateDetail>
) => {
  return await freightDetailRepo.update(critera, updateData);
};
