import { Request, Response } from "express";
import { Like } from "typeorm";
import { keywordDistinctOnFindBy, keywordFind } from "../../model/repository/keyword.repository";
import {
  searchDelete,
  searchDistinctOnFindBy,
} from "../../model/repository/search_history.repository";
import logger from "../../util/logger";

const NAMESPACE = "ClientSearch";

export const searchIndex = async (req: Request, res: Response) => {
  const userId = req.user_id !== null && req.user_id !== undefined ? req.user_id : 0;

  try {
    // get default Keywords
    const defaultKeywords = await keywordFind({ where: { is_default: 1 }, take: 1 });

    const hotKeywordList = await keywordDistinctOnFindBy({ is_hot: 1 }, "keyword");

    const historyKeywordList = await searchDistinctOnFindBy({ user_id: userId }, "keyword");

    const returnData = { defaultKeywords, hotKeywordList, historyKeywordList };
    return res.send({ data: returnData, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).send({ errmsg: error.message, errno: 500, error });
  }
};

export const searchHelper = async (req: Request, res: Response) => {
  let { keyword } = req.query;

  try {
    const keywordList = await keywordDistinctOnFindBy({ keyword: Like(`${keyword}%`) }, "keyword");
    return res.send({ data: keywordList, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const deleteSearchHistory = async (req: Request, res: Response) => {
  const userId = req.user_id;
  try {
    await searchDelete({ user_id: userId });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};
