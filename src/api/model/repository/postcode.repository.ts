import {
  Brackets,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm";
import { dataSource } from "../data-source";
import Keywords from "../entity/keywords.entity";
import Postcodes from "../entity/postcode.entity";
import BaseRepository from "./Base.Repository";

const postcodeRepo = new BaseRepository(Postcodes, dataSource);

export const postcodeFind = async (
  options: FindManyOptions<Postcodes> | undefined
): Promise<Postcodes[]> => {
  return await postcodeRepo.find(options);
};

export const postcodeFindBy = async (
  whereClause: FindOptionsWhere<Postcodes> | FindOptionsWhere<Postcodes>[]
): Promise<Postcodes[]> => {
  return await postcodeRepo.findBy(whereClause);
};

export const postcodeFindOneBy = async (
  whereClause: FindOptionsWhere<Postcodes> | FindOptionsWhere<Postcodes>[]
): Promise<Postcodes | null> => {
  return await postcodeRepo.findOneBy(whereClause);
};

export const postcodesDistinctOnFindBy = async (
  whereClause:
    | string
    | Brackets
    | ObjectLiteral
    | ObjectLiteral[]
    | ((qb: SelectQueryBuilder<Keywords>) => string),
  columnName: string
) => {
  return await postcodeRepo
    .createQueryBuilder()
    .select(`Distinct ${columnName}`)
    .where(whereClause)
    .orderBy("name", "ASC")
    .getRawMany();
};
