import { Request, Response } from "express";
import moment from "moment";
import {
  adFind,
  adFindAndCount,
  adFindOne,
  adInsert,
  adUpdateById,
} from "../../model/repository/ad.repository";
import { goodsFind } from "../../model/repository/goods.repository";
import logger from "../../util/logger";

const NAMESPACE = "Ad";

const getAllAds = async (req: Request, res: Response) => {
  let { page } = req.query;
  let pageSize = 10;
  try {
    const [ads, count] = await adFindAndCount({
      where: { is_delete: 0 },
      order: {
        id: "ASC",
      },
      take: pageSize,
      skip: (Number(page) - 1) * pageSize,
    });
    let totalPages = Math.ceil(count / pageSize);

    ads.forEach((ad) => {
      const hasEndTime: boolean = ad.end_time !== 0;
      const isEnaled: boolean = ad.enabled === 1;
      if (hasEndTime)
        ad.end_time = moment.unix(ad.end_time as number).format("YYYY-MM-DD HH:mm:ss");
      if (isEnaled) ad.enabled = true;
      else ad.enabled = false;
    });
    const data = { count, currentPage: page, data: ads, pageSize, totalPages };
    return res.json({ data, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const updateAdSort = async (req: Request, res: Response) => {
  let { id, sort } = req.body;

  try {
    const updateResult = await adUpdateById(id, { sort_order: sort });
    const updateSuccess: boolean = updateResult.affected !== 0;
    if (!updateSuccess) {
      return res.status(404).json({
        message: "Ads not found",
      });
    } else return res.json({ data: 1, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const updateAdSaleStatus = async (req: Request, res: Response) => {
  let { status, id } = req.query;
  let enabled = 0;
  if (status === "true") enabled = 1;
  try {
    const result = await adUpdateById(Number(id), { enabled });
    const updateSuccess: boolean = result.affected !== 0;
    if (!updateSuccess) return res.json({ errmsg: "Ads not found", errno: 404 });
    else return res.sendStatus(200);
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const getAdInfo = async (req: Request, res: Response) => {
  let { id } = req.query;

  try {
    const ad = await adFindOne({ where: { id: Number(id) } });
    if (ad) return res.json({ data: ad, errmsg: "", errno: 0 });
    else return res.status(404).json({ errmsg: "Ads not found...", errno: 404 });
  } catch (e: any) {
    logger.error(NAMESPACE, e.message, e);
    return res.status(500).send({ errmsg: e.message, errno: 500, e });
  }
};

const getAllRelate = async (req: Request, res: Response) => {
  let { id } = req.body;

  try {
    const goods = await goodsFind({
      select: ["id", "name", "list_pic_url"],
      where: { is_on_sale: 1, is_delete: 0 },
    });

    return res.json({ data: goods, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const updateAd = async (req: Request, res: Response) => {
  let ad = req.body;
  ad.end_time = new Date(ad.end_time).getTime() / 1000;
  if (Number(ad.id) > 0) {
    await adUpdateById(ad.id, ad)
      .then(() => {
        return res.json({ data: ad, errmsg: "", errno: 0 });
      })
      .catch((error) => {
        logger.error(NAMESPACE, error.message, error);
        return res.status(500).json({
          errmsg: error.message,
          errno: 500,
          error,
        });
      });
  } else {
    await adFind({ where: { goods_id: ad.goods_id, is_delete: 0 } }).then((ads) => {
      if (ads.length === 0) {
        let tempData = ad;
        if (ad.link_type === 0) tempData.link = "";
        else tempData.goods_id = 0;
        delete tempData.id;
        adInsert(tempData).catch((error) => {
          logger.error(NAMESPACE, error.message, error);
          return res.status(500).json({
            errmsg: error.message,
            errno: 500,
            error,
          });
        });
        return res.json({
          data: tempData,
          errmsg: "",
          errno: 0,
        });
      } else {
        return res.status(100).json({
          message: "Error",
        });
      }
    });
  }
};

const deleteAd = async (req: Request, res: Response) => {
  let { id } = req.body;

  await adUpdateById(id, { is_delete: 1 })
    .then(() => {
      return res.json({ data: 1, errmsg: "", errno: 0 });
    })
    .catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(500).json({ errmsg: error.message, errno: 500, error });
    });
};

export default {
  getAllAds,
  updateAdSort,
  updateAdSaleStatus,
  getAdInfo,
  getAllRelate,
  updateAd,
  deleteAd,
};
