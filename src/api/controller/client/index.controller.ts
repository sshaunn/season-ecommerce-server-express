import { Request, Response } from "express";
import logger from "../../util/logger";
import { adFind } from "../../model/repository/ad.repository";
import { noticeFind } from "../../model/repository/notice.repository";
import { categoryFind } from "../../model/repository/category.repository";
import { MoreThanOrEqual } from "typeorm";
import Goods from "../../model/entity/goods.entity";

const NAMESPECE = "ClientIndex";

const getAppInfo = async (req: Request, res: Response) => {
  try {
    const [banner, notice, categoryList, channel] = await Promise.all([
      adFind({ where: { enabled: 1, is_delete: 0 }, order: { sort_order: "ASC" } }),
      noticeFind({ where: { is_delete: 0 } }),
      categoryFind({
        relations: ["goods"],
        where: {
          is_channel: 1,
          parent_id: 0,
          goods: { goods_number: MoreThanOrEqual(0), is_on_sale: 1, is_index: 1, is_delete: 0 },
        },
        order: { sort_order: "ASC", goods: { sort_order: "ASC" } },
      }),
      categoryFind({ where: { parent_id: 0, is_show: 1 }, order: { sort_order: "ASC" } }),
    ]);
    let tempCateList: {
      id: number;
      name: string;
      goodsList: Goods[];
      banner: string;
      height: number;
    }[] = [];
    categoryList.forEach((cate) => {
      tempCateList.push({
        id: cate.id,
        name: cate.name,
        goodsList: cate.goods,
        banner: cate.img_url,
        height: cate.p_height,
      });
    });

    return res.json({
      data: { banner, notice, channel, categoryList: tempCateList },
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPECE, error.message, error);
    return res.status(500).json({
      errno: 500,
      errmsg: error.message,
      error,
    });
  }
};

export default { getAppInfo };
