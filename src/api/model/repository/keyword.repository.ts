import { dataSource } from "../data-source";
import BaseRepository from "./Base.Repository";
import Keywords from "../entity/keywords.entity";
import {
  Brackets,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm";

const keywordRepo = new BaseRepository(Keywords, dataSource);

export const keywordFindBy = async (
  whereClause: FindOptionsWhere<Keywords> | FindOptionsWhere<Keywords>[]
): Promise<Keywords[]> => {
  return await keywordRepo.findBy(whereClause);
};

export const keywordFind = async (options: FindManyOptions<Keywords> | undefined) => {
  return await keywordRepo.find(options);
};

export const keywordDistinctOnFindBy = async (
  whereClause:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: SelectQueryBuilder<Keywords>) => string),
  columnName: string
) => {
  return await keywordRepo
    .createQueryBuilder()
    .select(`Distinct ${columnName}`)
    .where(whereClause)
    .limit(10)
    .getRawMany();
};
