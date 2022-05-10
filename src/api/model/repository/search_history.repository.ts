import { dataSource } from "../data-source";
import BaseRepository from "./Base.Repository";
import SearchHistory from "../entity/search_history.entity";
import {
  Brackets,
  DeleteResult,
  FindOptionsWhere,
  ObjectID,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const searchRepo = new BaseRepository(SearchHistory, dataSource);

export const searchFindBy = async (
  whereClause: FindOptionsWhere<SearchHistory> | FindOptionsWhere<SearchHistory>[]
): Promise<SearchHistory[]> => {
  return await searchRepo.findBy(whereClause);
};

export const searchDistinctOnFindBy = async (
  whereClause:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: SelectQueryBuilder<SearchHistory>) => string),
  column: string
) => {
  return await searchRepo
    .createQueryBuilder()
    .select(`Distinct ${column}`)
    .where(whereClause)
    .limit(10)
    .getRawMany();
};

export const searchKeywordInsert = async (
  insertData: QueryDeepPartialEntity<SearchHistory> | QueryDeepPartialEntity<SearchHistory>[]
) => {
  return await searchRepo.insert(insertData);
};

export const searchDelete = async (
  givenConditions:
    | string
    | number
    | string[]
    | FindOptionsWhere<SearchHistory>
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
): Promise<DeleteResult> => {
  return await searchRepo.delete(givenConditions);
};
