import BaseRepository from "./Base.Repository";
import Notice from "../entity/notice.entity";
import { dataSource } from "../data-source";
import { FindManyOptions } from "typeorm";

const noticeRepo = new BaseRepository(Notice, dataSource);

export const noticeFind = async (
  options: FindManyOptions<Notice> | undefined
): Promise<Notice[]> => {
  return await noticeRepo.find(options);
};
