import {
  Brackets,
  FindManyOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectID,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import FreightTemplate from "../entity/freight_template.entity";
import Keywords from "../entity/keywords.entity";
import BaseRepository from "./Base.Repository";

const freightRepo = new BaseRepository(FreightTemplate, dataSource);

export const freightTemplateFind = async (
  options: FindManyOptions<FreightTemplate> | undefined
): Promise<FreightTemplate[]> => {
  return await freightRepo.find(options);
};

export const freightTemplateFindBy = async (
  whereClause: FindOptionsWhere<FreightTemplate> | FindOptionsWhere<FreightTemplate>[]
): Promise<FreightTemplate[]> => {
  return await freightRepo.findBy(whereClause);
};

export const freightTemplateInsert = async (
  insertData: QueryDeepPartialEntity<FreightTemplate> | QueryDeepPartialEntity<FreightTemplate>[]
): Promise<InsertResult> => {
  return await freightRepo.insert(insertData);
};

export const freightTemplateUpdate = async (
  critera:
    | string
    | number
    | string[]
    | FindOptionsWhere<FreightTemplate>
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[],
  updateData: QueryDeepPartialEntity<FreightTemplate>
) => {
  return await freightRepo.update(critera, updateData);
};

export const freightTemplateDelete = async (
  idOrWhereClause:
    | string
    | number
    | string[]
    | FindOptionsWhere<FreightTemplate>
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
) => {
  await freightRepo.delete(idOrWhereClause);
};
