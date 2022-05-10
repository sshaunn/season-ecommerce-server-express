import { Request, Response, NextFunction } from "express";
import logger from "../../util/logger";
import SpecificationRepository, {
  specificationInsert,
} from "../../model/repository/specification.repository";
import { goodsSpecificationFind } from "../../model/repository/goods_specification.repository";
import { productFind } from "../../model/repository/product.repository";

const NAMESPACE = "Specification";

const getAllSpecification = async (req: Request, res: Response) => {
  await SpecificationRepository.getAll({
    order: {
      sort_order: "ASC",
    },
  })
    .then(async (specificationList) => {
      if (specificationList.length !== 0) {
        return res.status(200).json({
          data: specificationList,
          errno: 0,
          errmsg: "",
        });
      }
    })
    .catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(200).json({
        errmsg: error.message,
        errno: 500,
        error,
      });
    });
};

const getSpecification = async (req: Request, res: Response) => {
  let { id } = req.body;
  await SpecificationRepository.findById(id)
    .then(async (specification) => {
      if (specification) {
        return res.status(200).json({
          data: specification,
          errmsg: "",
          errno: 0,
        });
      } else {
        return res.status(404).json({
          errmsg: "specification no found...",
        });
      }
    })
    .catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        errmsg: error.message,
        errno: 500,
        error,
      });
    });
};

const updateSpecification = async (req: Request, res: Response) => {
  let { id, name, sort_order } = req.body;
  await SpecificationRepository.update(id, {
    name: name,
    sort_order: sort_order,
  }).catch((error) => {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  });
  return res.status(200).json({
    data: 1,
    errmsg: "",
    errno: 0,
  });
};

const deleteSpecification = async (req: Request, res: Response) => {
  let { id } = req.body;
  await SpecificationRepository.delete(id).catch((error) => {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  });
  return res.status(200).json({
    data: 1,
    errmsg: "",
    errno: 0,
  });
};

const getGoodsSpec = async (req: Request, res: Response) => {
  let { id } = req.body;

  try {
    const products = await productFind({ where: { goods_id: id, is_delete: 0 } });
    let specId: number | string = 0;
    for (let product of products) {
      const goodsSpecs = await goodsSpecificationFind({
        where: { id: product.goods_specification_ids, is_delete: 0 },
      });
      specId = goodsSpecs[0].specification_id;
      product.value = goodsSpecs[0].value;
    }
    return res.json({
      data: {
        specData: products,
        specValue: specId,
      },
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

const addSpecification = async (req: Request, res: Response) => {
  let { name, sort_order } = req.body;

  try {
    const result = await specificationInsert({ name: name, sort_order: sort_order });

    return res.json({ data: result.generatedMaps, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

export default {
  getAllSpecification,
  getSpecification,
  updateSpecification,
  deleteSpecification,
  getGoodsSpec,
  addSpecification,
};
