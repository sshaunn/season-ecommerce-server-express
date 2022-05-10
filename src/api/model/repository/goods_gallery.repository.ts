import { DeleteResult, FindManyOptions, FindOptionsWhere, InsertResult, ObjectID } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { dataSource } from "../data-source";
import GoodsGallery from "../entity/goods_gallery.entity";
import BaseRepository from "./Base.Repository";

const goodsGalleryRepo = new BaseRepository(GoodsGallery, dataSource);

export const goodsGalleryFind = async (
  options: FindManyOptions<GoodsGallery> | undefined
): Promise<GoodsGallery[]> => {
  return await goodsGalleryRepo.find(options);
};

export const goodsGalleryUpdate = async (
  id: string | number,
  updateData: QueryDeepPartialEntity<GoodsGallery>
) => {
  return await goodsGalleryRepo.update(id, updateData);
};

export const goodsGalleryInsert = async (
  insertData: QueryDeepPartialEntity<GoodsGallery> | QueryDeepPartialEntity<GoodsGallery>[]
): Promise<InsertResult> => {
  return await goodsGalleryRepo.insert(insertData);
};

export const goodsGalleryDelete = async (
  id:
    | string
    | number
    | string[]
    | Date
    | ObjectID
    | number[]
    | Date[]
    | ObjectID[]
    | FindOptionsWhere<GoodsGallery>
): Promise<DeleteResult> => {
  return await goodsGalleryRepo.delete(id);
};
