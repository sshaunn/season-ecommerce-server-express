import { Request, Response } from "express";
import moment from "moment";
import {
  footprintDelete,
  footprintFind,
  footprintFindAndCount,
} from "../../model/repository/footprint.repository";
import logger from "../../util/logger";

const NAMESPACE = "ClientFootprint";

export const getFootprintList = async (req: Request, res: Response) => {
  let { page, size } = req.body;
  let userId = req.user_id;
  try {
    const [footprintList, count] = await footprintFindAndCount({
      relations: ["goods"],
      select: ["id", "goods_id", "add_time", "goods"],
      where: { user_id: userId },
      take: size,
      skip: (Number(page) - 1) * 10,
      order: { add_time: "DESC" },
    });
    const totalPages = Math.ceil(count / Number(size));
    footprintList.forEach(
      (footprint) =>
        (footprint.add_time = moment.unix(Number(footprint.add_time)).format("YYYY-MM-DD"))
    );

    return res.send({ data: footprintList, page, size, totalPages, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export const deleteFootprint = async (req: Request, res: Response) => {
  let { id } = req.body;
  let userId = req.user_id;

  try {
    await footprintDelete({ id: id });
    return res.send({ data: "Deleted...", errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};
