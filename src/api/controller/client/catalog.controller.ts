import { Request, Response } from "express";
import { Equal, In, Not } from "typeorm";
import Category from "../../model/entity/category.entity";
import {
  categoryFind,
  categoryFindBy,
  categoryFindOne,
} from "../../model/repository/category.repository";
import { goodsFindAndCount } from "../../model/repository/goods.repository";
import logger from "../../util/logger";

const NAMESPACE = "ClientCatelog";

/**
 * Add temp property 'childs' into Entity Category in file Category.entity.ts... which include all sub categories
 * Flat all sub-category IDs and push to id array...
 * @param array
 * @param cateIds
 */
const flattenArrayOfObject = (array: Category[], cateIds: number[]): any => {
  array.forEach((item) => {
    if (item.childs) {
      if (item.childs.length !== 0 || item.parent_id !== 0) {
        if (item.is_category === 1) cateIds.push(item.id);

        flattenArrayOfObject(item.childs, cateIds);
      }
    }
  });
};

const getCatalogIndex = async (req: Request, res: Response) => {
  try {
    const tempCategoryList = await categoryFind({
      where: {
        // parent_id: 0,
        is_category: 1,
      },
      order: { sort_order: "ASC" },
    });

    // check if category has sub-category
    let subCategoryList: Category[] = [];
    tempCategoryList.forEach((category) => {
      const isSubCategory = category.level > 1;
      if (isSubCategory) {
        subCategoryList.push(category);
      }
    });

    tempCategoryList.map((category) => {
      category.childs = subCategoryList.filter(
        (subCategory) => category.id === subCategory.parent_id
      );
    });

    const categoryList = tempCategoryList.filter((category) => category.parent_id === 0);

    return res.json({
      data: { categoryList },
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

const getCurrentList = async (req: Request, res: Response) => {
  let { id, page, size } = req.body;
  const isMainCategory: boolean = id === 0;

  try {
    if (isMainCategory) {
      const [goodsList, count] = await goodsFindAndCount({
        where: { is_on_sale: 1, is_delete: 0 },
        order: { sort_order: "ASC" },
        take: size,
        skip: (page - 1) * size,
      });
      let totalPages = Math.ceil(count / size);
      return res.json({
        data: {
          data: goodsList,
          count,
          currentPage: page,
          pageSize: size,
          totalPages,
        },
        errmsg: "",
        errno: 0,
      });
    } else {
      const tempCategoryList = await categoryFind({
        where: {
          // parent_id: 0,
          is_category: 1,
        },
        order: { sort_order: "ASC" },
      });

      // check if category has sub-category
      let subCategoryList: Category[] = [];
      tempCategoryList.forEach((category) => {
        const isSubCategory = category.level > 1;
        if (isSubCategory) {
          subCategoryList.push(category);
        }
      });

      tempCategoryList.map((category) => {
        category.childs = subCategoryList.filter(
          (subCategory) => category.id === subCategory.parent_id
        );
      });

      const categoryList = tempCategoryList.filter(
        (category) => category.parent_id === 0 && category.id === id
      );

      let cateIds: any[] = [id];
      flattenArrayOfObject(categoryList, cateIds);
      console.log("id array", cateIds);

      const [goodsList, count] = await goodsFindAndCount({
        // relations: ["Goods"],
        where: { is_delete: 0, is_on_sale: 1, category_id: In(cateIds) },
        order: { sort_order: "ASC" },
        take: size,
        skip: (page - 1) * size,
      });

      let totalPages = Math.ceil(count / size);
      return res.json({
        data: {
          data: goodsList,
          count,
          currentPage: page,
          pageSize: size,
          totalPages,
        },
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
};

const getCurrent = async (req: Request, res: Response) => {
  let { id } = req.query;
  try {
    const currentCatalog = await categoryFindOne({
      select: ["id", "name", "img_url", "p_height"],
      where: { id: Number(id) },
    });
    if (currentCatalog) {
      return res.json({
        data: currentCatalog,
        errmsg: "",
        errno: 0,
      });
    } else {
      return res.status(404).json({
        errmsg: "Catalog not found...",
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

export default { getCatalogIndex, getCurrentList, getCurrent };
