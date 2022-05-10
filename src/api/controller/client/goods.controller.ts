import { Request, Response } from "express";
import { FindOptionsOrder, FindOptionsWhere, Like } from "typeorm";
import Goods from "../../model/entity/goods.entity";
import { footprintInsert } from "../../model/repository/footprint.repository";
import {
  goodsCount,
  goodsFind,
  goodsFindBy,
  goodsFindOne,
} from "../../model/repository/goods.repository";
import { goodsGalleryFind } from "../../model/repository/goods_gallery.repository";
import { goodsSpecificationFind } from "../../model/repository/goods_specification.repository";
import { productFind, productFindOne } from "../../model/repository/product.repository";
import { searchKeywordInsert } from "../../model/repository/search_history.repository";
import {
  specificationFind,
  specificationFindOne,
} from "../../model/repository/specification.repository";
import logger from "../../util/logger";

const NAMESPACE = "ClientGoods";

const getGoodsCount = async (req: Request, res: Response) => {
  try {
    const count = await goodsCount({ where: { is_delete: 0, is_on_sale: 1 } });

    return res.json({
      data: { goodsCount: count },
      errmsg: "",
      errno: 0,
    });
  } catch (err: any) {
    logger.error(NAMESPACE, err.message, err);

    return res.status(500).json({ err, errmsg: err.message, errno: 500 });
  }
};

const getGoodsDetail = async (req: Request, res: Response) => {
  let { id } = req.query;
  let user_id = req.user_id;

  try {
    const goodsInfo = await goodsFindOne({ where: { id: Number(id), is_delete: 0 } });
    if (goodsInfo) {
      const galleries = await goodsGalleryFind({
        where: { goods_id: Number(id), is_delete: 0 },
        order: { sort_order: "ASC" },
        take: 6,
      });

      await footprintInsert({ user_id: user_id, goods_id: Number(id) });

      const productList = await productFind({
        where: { goods_id: Number(id), is_delete: 0, is_on_sale: 1 },
      });
      const goodsNumber: number = productList.reduce((total, item) => total + item.goods_number, 0);

      goodsInfo.goods_number = goodsNumber;

      const specList = await goodsSpecificationFind({
        where: { goods_id: Number(id), is_delete: 0 },
      });

      specList.forEach(async (spec) => {
        let prod = await productFindOne({
          where: { goods_specification_ids: spec.id, is_delete: 0 },
        });
        if (prod) {
          spec.goods_number = prod.goods_number;
        }
      });

      let specification_id = specList[0].specification_id;
      const specification = await specificationFindOne({ where: { id: specification_id } });
      let name = specification ? specification.name : "";

      return res.json({
        data: {
          info: goodsInfo,
          gallery: galleries,
          productList,
          specificationList: {
            name,
            specification_id,
            valueList: specList,
          },
        },
        errmsg: "",
        errno: 0,
      });
    } else {
      return res.status(404).json({
        errmsg: "Goods not found...",
        errno: 404,
      });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

const getGoodsList = async (req: Request, res: Response) => {
  let { keyword, sort, order, sales } = req.query;
  const userId = req.user_id !== null && req.user_id !== undefined ? req.user_id : 0;

  try {
    let whereClause: FindOptionsWhere<Goods> = { is_on_sale: 1, is_delete: 0 };
    const hasKeyword: boolean = keyword !== null && keyword !== undefined;

    if (hasKeyword) {
      keyword = Buffer.from(String(keyword), "base64").toString();
      whereClause = { ...whereClause, name: Like(`%${keyword}%`) };
      const insertData = { keyword, user_id: userId, add_time: new Date().getTime() / 1000 };
      await searchKeywordInsert(insertData);
    }

    let orderClause: any;
    order = String(order);
    sales = String(sales);
    if (sort === "price") orderClause = { retail_price: order };
    else if (sort === "sales") orderClause = { sell_volume: sales };
    else orderClause = { sort_order: "ASC" };

    const goodsData = await goodsFind({ where: whereClause, order: orderClause });
    return res.send({ data: goodsData, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).send({ errmsg: error.message, errno: 500, error });
  }
};

export default { getGoodsCount, getGoodsDetail, getGoodsList };
