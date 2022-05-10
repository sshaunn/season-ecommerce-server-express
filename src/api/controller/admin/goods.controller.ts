import { Request, Response } from "express";
import { Equal, FindOptionsOrder, LessThanOrEqual, Like, MoreThan, Not } from "typeorm";
import { dataSource } from "../../model/data-source";
import Goods from "../../model/entity/goods.entity";
import GoodsSpecification from "../../model/entity/goods_specification.entity";
import { cartUpdate, cartUpdateById } from "../../model/repository/cart.repository";
import { categoryFind, categoryFindOne } from "../../model/repository/category.repository";
import { freightTemplateFind } from "../../model/repository/freight_template.repository";
import {
  goodsCount,
  goodsFind,
  goodsFindAndCount,
  goodsFindOne,
  goodsInsert,
  goodsQueryRunner,
  goodsUpdate,
} from "../../model/repository/goods.repository";
import {
  goodsGalleryFind,
  goodsGalleryInsert,
  goodsGalleryUpdate,
} from "../../model/repository/goods_gallery.repository";
import {
  goodsSpecificationFind,
  goodsSpecificationInsert,
  goodsSpecificationUpdate,
  goodsSpecificationUpdateById,
} from "../../model/repository/goods_specification.repository";
import {
  productFind,
  productFindOne,
  productInsert,
  productSum,
  productUpdate,
  productUpdateById,
} from "../../model/repository/product.repository";
import Product from "../../model/entity/product.entity";
import { specificationFind } from "../../model/repository/specification.repository";
import logger from "../../util/logger";
import Category from "../../model/entity/category.entity";

const NAMESPACE = "Goods";

const getAllGoods = async (req: Request, res: Response) => {
  let { id, size, page, name, index } = req.query;
  name = name ? name : "";
  let orderBy: FindOptionsOrder<Goods>;
  if (index === "1") {
    orderBy = { sell_volume: "DESC" };
  } else if (index === "2") {
    orderBy = { retail_price: "DESC" };
  } else if (index === "3") {
    orderBy = { goods_number: "DESC" };
  } else {
    orderBy = { sort_order: "ASC" };
  }

  await goodsFindAndCount({
    relations: ["category", "products"],
    select: ["category", "products"],
    where: {
      name: Like(`%${name}%`),
      is_delete: 0,
      products: {
        is_delete: 0,
      },
    },
    order: orderBy,
    take: Number(size),
    skip: (Number(page) - 1) * Number(size),
  })
    .then(async ([data, count]) => {
      let totalPages = Math.ceil(count / Number(size));
      data.map(async (goods) => {
        goods.is_index === 1 ? (goods.is_index = true) : (goods.is_index = false);
        goods.is_on_sale === 1 ? (goods.is_on_sale = true) : (goods.is_on_sale = false);
        await categoryFindOne({
          select: { name: true },
          where: { id: goods.category_id },
        }).then((result) => {
          if (result) {
            return { ...goods, category_name: result.name };
          }
          // console.log(goods);
        });
      });
      // console.log(data);
      return res.json({
        data: {
          count,
          currentPage: page,
          data,
          pageSize: size,
          totalPages,
        },
      });
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

const getGoodsBy = async (req: Request, res: Response) => {
  let { status } = req.params;
  let { page, size } = req.query;
  try {
    if (status === "out") {
      const [goodsList, count] = await goodsFindAndCount({
        relations: ["category", "products"],
        select: ["category", "products"],
        where: {
          is_delete: 0,
          is_on_sale: 1,
          goods_number: LessThanOrEqual(0),
          products: {
            is_delete: 0,
          },
        },
        order: { sort_order: "ASC" },
        take: Number(size),
        skip: (Number(page) - 1) * Number(size),
      });
      let totalPages = Math.ceil(count / Number(size));

      // console.log(data);
      return res.json({
        data: {
          count,
          currentPage: page,
          data: goodsList,
          pageSize: size,
          totalPages,
        },
      });
    } else if (status === "drop") {
      const [goodsList, count] = await goodsFindAndCount({
        relations: ["category", "products"],
        select: ["category", "products"],
        where: {
          is_delete: 0,
          is_on_sale: 0,
          products: {
            is_delete: 0,
          },
        },
        order: { sort_order: "ASC" },
        take: Number(size),
        skip: (Number(page) - 1) * Number(size),
      });
      let totalPages = Math.ceil(count / Number(size));

      // console.log(data);
      return res.json({
        data: {
          count,
          currentPage: page,
          data: goodsList,
          pageSize: size,
          totalPages,
        },
      });
    } else if (status === "onsale") {
      const [goodsList, count] = await goodsFindAndCount({
        relations: ["category", "products"],
        select: ["category", "products"],
        where: {
          is_delete: 0,
          is_on_sale: 1,
          products: {
            is_delete: 0,
          },
        },
        order: { sort_order: "ASC" },
        take: Number(size),
        skip: (Number(page) - 1) * Number(size),
      });
      let totalPages = Math.ceil(count / Number(size));

      // console.log(data);
      return res.json({
        data: {
          count,
          currentPage: page,
          data: goodsList,
          pageSize: size,
          totalPages,
        },
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

const updateGoodsIndexShowStatus = async (req: Request, res: Response) => {
  let { status, id } = req.query;
  if (status === "true") {
    await goodsUpdate(Number(id), { is_index: 1 }).then((result) => {
      if (result.affected === 0) {
        return res.status(404).json({
          message: "Updated Goods not found",
        });
      } else {
        return res.json({
          data: 1,
          errmsg: "",
          errno: 0,
        });
      }
    });
  } else {
    await goodsUpdate(Number(id), { is_index: 0 }).then((result) => {
      if (result.affected === 0) {
        return res.status(404).json({
          message: "Updated Goods not found",
        });
      } else {
        return res.json({
          data: 1,
          errmsg: "",
          errno: 0,
        });
      }
    });
  }
};

const updateGoodsSaleStatus = async (req: Request, res: Response) => {
  let { status, id } = req.query;
  if (status === "true") {
    await goodsUpdate(Number(id), { is_on_sale: 1 })
      .then((result) => {
        if (result.affected === 0) {
          return res.status(404).json({
            message: "Updated Goods not found",
          });
        } else {
          return res.json({
            data: 1,
            errmsg: "",
            errno: 0,
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
    await cartUpdate({ checked: 1, is_on_sale: 1 }, { goods_id: id });
  } else {
    await goodsUpdate(Number(id), { is_on_sale: 0 })
      .then((result) => {
        if (result.affected === 0) {
          return res.status(404).json({
            message: "Updated Goods not found",
          });
        } else {
          return res.json({
            data: 1,
            errmsg: "",
            errno: 0,
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
    await cartUpdate({ checked: 0, is_on_sale: 0 }, { goods_id: id });
  }
};

const updateProductStatus = async (req: Request, res: Response) => {
  let { status, id } = req.query;

  if (status === "1") {
    await Promise.all([
      productUpdate(id as string, { is_on_sale: 1 }),
      cartUpdate({ is_on_sale: 1 }, { product_id: id }),
    ])
      .then(([resultP, resultC]) => {
        if (resultP.affected === 0 || resultC.affected === 0) {
          return res.status(404).json({
            message: "Updated Product not found",
            errorCode: 404,
          });
        } else {
          return res.json({
            data: 1,
            errmsg: "",
            errno: 0,
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
  } else {
    await Promise.all([
      productUpdate(id as string, { is_on_sale: 0 }),
      cartUpdate({ is_on_sale: 0 }, { product_id: id }),
    ])
      .then(([resultP, resultC]) => {
        if (resultP.affected === 0 || resultC.affected === 0) {
          return res.status(404).json({
            message: "Updated Product not found",
            errorCode: 404,
          });
        } else {
          return res.json({
            data: 1,
            errmsg: "",
            errno: 0,
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
  }
};

const updateSortOrder = async (req: Request, res: Response) => {
  let { id, sort } = req.body;

  await goodsUpdate(id, { sort_order: Number(sort) })
    .then((result) => {
      if (result.affected === 0) {
        return res.status(404).json({
          message: "Update fail",
          code: 404,
        });
      } else {
        return res.json({
          data: 1,
          errmsg: "",
          errno: 0,
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

const updateGoodsPrice = async (req: Request, res: Response) => {
  let currProduct = req.body;
  console.log(currProduct);
  try {
    await goodsSpecificationUpdate(currProduct.goods_specification_ids, {
      value: currProduct.value,
    });

    await productUpdate(currProduct.id, {
      goods_sn: currProduct.goods_sn,
      goods_number: currProduct.goods_number,
      retail_price: currProduct.retail_price,
      cost: currProduct.cost,
      goods_weight: currProduct.goods_weight,
      has_change: currProduct.has_change,
      goods_name: currProduct.goods_name,
      is_on_sale: currProduct.is_on_sale,
      is_delete: currProduct.is_delete,
    });
    await cartUpdate(
      {
        goods_sn: currProduct.goods_sn,
        retail_price: currProduct.retail_price,
        goods_specification_name_value: currProduct.value,
      },
      { product_id: currProduct?.id, is_delete: 0 }
    );
    const [sum, data] = await Promise.all([
      productSum("goods_number", { goods_id: currProduct?.goods_id, is_on_sale: 1, is_delete: 0 }),
      productFindOne({
        where: {
          goods_id: currProduct.goods_id,
          is_on_sale: 1,
          is_delete: 0,
        },
      }),
    ]);
    await goodsUpdate(currProduct.goods_id, {
      goods_number: sum,
      retail_price: data?.retail_price,
      min_retail_price: Math.min(data ? data.retail_price : 0),
      cost_price: data?.cost,
      min_cost_price: Math.min(data ? data.cost : 0),
    });
    return res.json({
      data: 1,
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  }
};

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const tempCategoryList = await categoryFind({
      // where: {
      //   // parent_id: 0,
      //   is_category: 1,
      // },
      order: { sort_order: "ASC" },
    });

    // check if category has sub-category
    let subCategoryList: Category[] = [];
    tempCategoryList.forEach((category) => {
      category.value = category.id;
      category.label = category.name;
      const isSubCategory = category.level > 1;
      if (isSubCategory) {
        subCategoryList.push(category);
      }
    });

    tempCategoryList.map((category) => {
      category.children = subCategoryList.filter(
        (subCategory) => category.id === subCategory.parent_id
      );
    });

    const categoryList = tempCategoryList.filter((category) => category.parent_id === 0);
    return res.send({ data: categoryList, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const getAllSpecification = async (req: Request, res: Response) => {
  await specificationFind({
    where: {
      id: MoreThan(0),
    },
  })
    .then((specs) => {
      let data = [];
      for (let item of specs) {
        data.push({
          value: item.id,
          label: item.name,
        });
      }
      return res.json({
        data,
        errmsg: "",
        errno: 0,
      });
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

const getAllExpress = async (req: Request, res: Response) => {
  let newCates: any[] = [];
  let newFretmps: any[] = [];
  await Promise.all([
    categoryFind({ where: { parent_id: 0 } }),
    freightTemplateFind({ where: { is_delete: 0 } }),
  ])
    .then(([cates, freitmps]) => {
      for (let item of cates) {
        newCates.push({
          value: item.id,
          label: item.name,
        });
      }
      for (let item of freitmps) {
        newFretmps.push({
          value: item.id,
          label: item.name,
        });
      }
      return res.json({
        data: {
          cate: newCates,
          kd: newFretmps,
        },
        errmsg: "",
        errno: 0,
      });
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

const getGoodsInfo = async (req: Request, res: Response) => {
  let { id } = req.query;

  await goodsFind({ where: { id: Number(id) } }).then((goods) => {
    if (goods.length !== 0) {
      return res.json({
        data: {
          category_id: goods[0].category_id,
          info: goods[0],
        },
        errmsg: "",
        errno: 0,
      });
    } else {
      return res.status(404).json({
        errmsg: "Goods not found",
        errno: 404,
      });
    }
  });
};

const getGoodsSpec = async (req: Request, res: Response) => {
  let { id } = req.body;

  await goodsSpecificationFind({ where: { goods_id: id } })
    .then((goodsSpec) => {
      if (goodsSpec.length !== 0) {
        return res.json({
          data: {
            specData: goodsSpec,
            specValue: goodsSpec[0].specification_id,
          },
          errmsg: "",
          errno: 0,
        });
      } else {
        return res.status(404).json({
          message: "GoodsSpec not found...",
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

const getGoodsGallery = async (req: Request, res: Response) => {
  let { goodsId } = req.body;

  await goodsGalleryFind({ where: { goods_id: goodsId, is_delete: 0 } })
    .then((goodsGallery) => {
      if (goodsGallery.length !== 0) {
        let list = [];
        for (let item of goodsGallery) {
          list.push({
            id: item.id,
            url: item.img_url,
          });
        }
        return res.json({
          data: {
            galleryData: list,
          },
          errmsg: "",
          errno: 0,
        });
      } else {
        return res.status(404).json({
          errmsg: "Goods Gallery not found...",
          errno: 404,
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

const deleteGalleryFile = async (req: Request, res: Response) => {
  let { id, url } = req.body;
  try {
    const result = await goodsGalleryUpdate(id, { is_delete: 1 });
    if (result.affected !== 0) {
      return res.json({
        affected: 1,
        errmsg: "",
        errno: 0,
      });
    }
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

const getGalleryList = async (req: Request, res: Response) => {
  let { id } = req.body;

  await goodsGalleryFind({ where: { goods_id: Number(id), is_delete: 0 } })
    .then((list) => {
      if (list.length !== 0) {
        return res.json({
          data: list,
          errmsg: "",
          errno: 0,
        });
      } else {
        return res.status(404).json({
          message: "Gallery is not found...",
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

const updateGallerySort = async (req: Request, res: Response) => {
  let galleryList = req.body.data;

  for (let item of galleryList) {
    await goodsGalleryUpdate(item.id, { sort_order: item.sort_order })
      .then((result) => {
        if (result.affected === 0) {
          return res.status(404).json({
            message: "Gallery updated fail, not found...",
            code: 404,
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
  }
  return res.json({
    data: "",
    errmsg: "",
    errno: 0,
  });
};

const upsertGoodsInfo = async (req: Request, res: Response) => {
  let { cateId, info, specData, specValue } = req.body;

  /**
   * there are bunch of atomic database operation,
   * set up transaction here
   * if any error happens, all database operations are gona rollback
   */
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  let goodsId = info.id;
  info.is_index = info.is_index ? 1 : 0;
  info.is_new = info.is_new ? 1 : 0;

  try {
    if (Number(info.id) !== 0) {
      /**
       * if info.id exist then update
       */
      // step 1 here, update Goods here which is already exists
      await queryRunner.manager.save(Goods, info);

      // step 2 here, update cart record even if there is not any cart record in database
      await cartUpdate(
        {
          checked: info.is_on_sale,
          is_on_sale: info.is_on_sale,
          list_pic_url: info.list_pic_url,
          freight_template_id: info.freight_template_id,
        },
        { goods_id: info.id }
      );

      await productUpdateById({ is_delete: 1 }, { goods_id: info.id });
      await goodsSpecificationUpdate({ goods_id: info.id }, { is_delete: 1 });

      await Promise.all(
        specData.map(async (item: any) => {
          let tempGoodSpecValue = item.value;
          let tempItem = item;
          delete tempItem.value;
          if (Number(item.id) > 0) {
            await cartUpdate(
              { product_id: item.id, is_delete: 0 },
              {
                retail_price: item.retail_price,
                goods_specification_name_value: item.value,
                goods_sn: item.goods_sn,
              }
            );
            item.is_delete = 0;
            await productUpdate(tempItem.id, tempItem);
            let tempSpecData = {
              value: tempGoodSpecValue,
              specification_id: specValue,
              is_delete: 0,
            };
            await goodsSpecificationUpdate(item.goods_specification_ids, tempSpecData);
          } else {
            let tempSpecData = { value: tempGoodSpecValue, goods_id: info.id, is_delete: 0 };
            const specInsertResult = await goodsSpecificationInsert(tempSpecData);
            item.goods_specification_ids = specInsertResult.identifiers[0].id;
            item.goods_id = info.id;
            await productInsert(tempItem);
          }
        })
      );
      // queryRunner.rollbackTransaction();
    } else {
      /**
       * if info.id not exist, then insert
       */

      // so step 1 here, to insert new Goods record into database.
      delete info.id;
      const insertedGoods: Goods | any = await queryRunner.manager.save(Goods, {
        ...info,
        category_id: cateId,
      });

      goodsId = insertedGoods.id;
      console.log(insertedGoods, goodsId);

      // step 2 here, to set up the specifications of the new Goods record,
      // it may be in multiple specifications
      await Promise.all(
        specData.map(async (spec: any) => {
          let specInsertData = {
            value: spec.value,
            goods_id: insertedGoods.id,
            specification_id: specValue,
          };
          const insertedSpec = await queryRunner.manager.save(GoodsSpecification, specInsertData);
          spec.goods_specification_ids = insertedSpec.id;
          spec.goods_id = goodsId;
          spec.is_on_sale = 1;
          spec.is_delete = 0;

          // step 3 here, one or many Products under the Goods,
          // so insert all of Products then
          await queryRunner.manager.save(Product, spec);
        })
      );
    }

    // GET all insterted Products records...
    let productList = await queryRunner.manager.find(Product, {
      where: {
        goods_id: goodsId,
        is_on_sale: 1,
        is_delete: 0,
      },
    });

    if (productList.length !== 0) {
      // step 4 here, this whole if block is to compute the Goods attributes and update them...
      //
      let goods_number = productList.reduce((total, product) => total + product.goods_number, 0);
      let priceArray: number[] = [];
      let costArray: number[] = [];
      let minPrice;
      let minCost;
      let goodsPrice;
      let goodsCost;

      productList.forEach((product) => {
        priceArray.push(product.retail_price);

        costArray.push(product.cost);
      });
      minPrice = Math.min(...priceArray);
      minCost = Math.min(...costArray);
      goodsPrice = minPrice + " ~ " + Math.max(...priceArray);
      goodsCost = minCost + " ~ " + Math.max(...costArray);

      const updateResult = await queryRunner.manager.update(Goods, goodsId, {
        goods_number: goods_number,
        retail_price: goodsPrice,
        cost_price: goodsCost,
        min_retail_price: minPrice,
        min_cost_price: minCost,
      });

      const goodsInfo = await queryRunner.manager.find(Goods, { where: { id: goodsId } });
      // console.log("updateresult", updateResult);
      await queryRunner.commitTransaction();
      // await queryRunner.rollbackTransaction();
      return res.json({
        data: goodsInfo[0],
        errmsg: "",
        errno: 0,
      });
    }
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      errmsg: error.message,
      errno: 500,
      error,
    });
  } finally {
    await queryRunner.release();
  }
};

const copyGoods = async (req: Request, res: Response) => {
  let { id } = req.body;

  await goodsFind({ where: { id: id } }).then(async (goods) => {
    if (goods.length === 0) {
      return res.status(404).json({
        message: "Goods not found...",
      });
    } else {
      let currGoods: any = goods[0];
      delete currGoods.id;
      currGoods.is_on_sale = 0;
      try {
        const insertResult = await goodsInsert(currGoods);
        const insertId = insertResult.identifiers[0].id;
        const goodsGallery = await goodsGalleryFind({
          where: { goods_id: id, is_delete: 0 },
        });
        if (goodsGallery.length === 0) {
          return res.status(404).json({
            errmsg: "GoodsGallery not found",
            errno: 404,
          });
        } else {
          for (let item of goodsGallery) {
            let gallery = {
              img_url: item.img_url,
              sort_order: item.sort_order,
              goods_id: insertId,
            };
            await goodsGalleryInsert(gallery);
          }

          return res.json({
            data: insertId,
            errmsg: "",
            errno: 0,
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
    }
  });
};

const checkGoodsSKU = async (req: Request, res: Response) => {
  let { info } = req.body;
  try {
    if (Number(info.id) > 0) {
      await productFind({
        where: {
          id: Not(Equal(info.id)),
          goods_sn: info.goods_sn,
          is_delete: 0,
        },
      }).then((data) => {
        if (data.length === 0) {
          return res.json({
            data: "",
            errmsg: "",
            errno: 0,
          });
        } else {
          return res.status(100).json({
            message: "Goods SKU is already exist...",
          });
        }
      });
    } else {
      await productFind({
        where: {
          goods_sn: info.goods_sn,
          is_delete: 0,
        },
      }).then((data) => {
        if (data.length === 0) {
          return res.json({
            data: "",
            errmsg: "",
            errno: 0,
          });
        } else {
          return res.status(100).json({
            message: "Goods SKU is already exist...",
          });
        }
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

const addGallery = async (req: Request, res: Response) => {
  let { url, goods_id } = req.body;

  await goodsGalleryInsert({
    goods_id,
    img_url: url,
  })
    .then(() => {
      return res.json({
        data: "",
        errmsg: "",
        errno: 0,
      });
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

const deleteGoods = async (req: Request, res: Response) => {
  let { id } = req.body;

  try {
    const resultGoods = await goodsUpdate(id, { is_delete: 1 });
    const resultProducts = await productUpdateById({ is_delete: 1 }, { goods_id: id });
    const resultGoodsSpecs = await goodsSpecificationUpdateById({ is_delete: 1 }, { goods_id: id });
    return res.json({
      data: { resultGoods, resultProducts, resultGoodsSpecs },
      errmsg: "",
      errno: 0,
    });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);

    return res.status(500).json({
      message: error.message,
      error,
    });
  }
};

export default {
  getAllGoods,
  getGoodsBy,
  updateGoodsIndexShowStatus,
  updateGoodsSaleStatus,
  updateProductStatus,
  updateGoodsPrice,
  updateSortOrder,
  getAllCategory,
  getAllSpecification,
  getAllExpress,
  getGoodsInfo,
  getGoodsSpec,
  getGoodsGallery,
  getGalleryList,
  updateGallerySort,
  copyGoods,
  checkGoodsSKU,
  addGallery,
  deleteGalleryFile,
  deleteGoods,
  upsertGoodsInfo,
};
