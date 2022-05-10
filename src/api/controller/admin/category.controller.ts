import { Request, Response, NextFunction } from "express";
import logger from "../../util/logger";
import CategoryRepository, {
  categoryDelete,
  categoryFind,
  categoryUpdateById,
} from "../../model/repository/category.repository";
import Category from "../../model/entity/category.entity";

const NAMESPACE = "Category";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    // const categoryList = await categoryFind({ order: { sort_order: "ASC" } });

    const tempCategoryList = await categoryFind({
      where: {
        // parent_id: 0,
        // is_category: 1,
      },
      order: { sort_order: "ASC" },
    });

    // check if category has sub-category
    let subCategoryList: Category[] = [];
    tempCategoryList.forEach((category) => {
      category.label = category.name;
      category.children = category.childs;
      const isSubCategory = category.level > 1;
      if (isSubCategory) {
        subCategoryList.push(category);
      }
    });

    tempCategoryList.map((category) => {
      category.children = subCategoryList.filter(
        (subCategory) => category.id === subCategory.parent_id
      );
      // category.children = category.childs;
    });
    tempCategoryList.forEach((category) => {
      category.is_category =
        category.is_category === 1 ? (category.is_category = true) : (category.is_category = false);
      category.is_channel =
        category.is_channel === 1 ? (category.is_channel = true) : (category.is_channel = false);
      category.is_show =
        category.is_show === 1 ? (category.is_show = true) : (category.is_show = false);
    });

    const categoryList = tempCategoryList.filter((category) => category.parent_id === 0);

    return res.send({ data: categoryList, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

const updateStatus = async (req: Request, res: Response) => {
  let { status, id } = req.query;
  let { url } = req.params;
  await CategoryRepository.findById(Number(id))
    .then(async (category) => {
      console.log(category);
      if (url === "categoryStatus") {
        if (status === "true") {
          logger.info(NAMESPACE, "updating category status...");
          await CategoryRepository.update(Number(id), {
            is_category: 1,
          }).catch((error) => {
            logger.error(NAMESPACE, error.message, error);
            return res.status(500).json({
              errmsg: error.message,
              errno: 500,
              error,
            });
          });
          return res.sendStatus(200);
        } else {
          logger.info(NAMESPACE, "updating category status...");

          await CategoryRepository.update(Number(id), {
            is_category: 0,
          }).catch((error) => {
            logger.error(NAMESPACE, error.message, error);
            return res.status(500).json({
              errmsg: error.message,
              errno: 500,
              error,
            });
          });
          return res.sendStatus(200);
        }
      }
      if (url === "channelStatus") {
        if (status === "true") {
          logger.info(NAMESPACE, "updating category status...");
          await CategoryRepository.update(Number(id), {
            is_channel: 1,
          }).catch((error) => {
            logger.error(NAMESPACE, error.message, error);
            return res.status(500).json({
              errmsg: error.message,
              errno: 500,
              error,
            });
          });
          return res.sendStatus(200);
        } else {
          logger.info(NAMESPACE, "updating category status...");

          await CategoryRepository.update(Number(id), {
            is_channel: 0,
          }).catch((error) => {
            logger.error(NAMESPACE, error.message, error);
            return res.status(500).json({
              errmsg: error.message,
              errno: 500,
              error,
            });
          });
          return res.sendStatus(200);
        }
      }
      if (url === "showStatus") {
        if (status === "true") {
          logger.info(NAMESPACE, "updating category status...");
          await CategoryRepository.update(Number(id), {
            is_show: 1,
          }).catch((error) => {
            logger.error(NAMESPACE, error.message, error);
            return res.status(500).json({
              errmsg: error.message,
              errno: 500,
              error,
            });
          });
          return res.sendStatus(200);
        } else {
          logger.info(NAMESPACE, "updating category status...");

          await CategoryRepository.update(Number(id), {
            is_show: 0,
          }).catch((error) => {
            logger.error(NAMESPACE, error.message, error);
            return res.status(500).json({
              errmsg: error.message,
              errno: 500,
              error,
            });
          });
          return res.sendStatus(200);
        }
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

/**
 * Get category information object when admin edit the specific category details,
 * then save the updated data to database using getRepository.save()
 *
 * @param req
 * @param res
 */
const getInfo = async (req: Request, res: Response) => {
  let { id } = req.query;
  await CategoryRepository.findById(Number(id))
    .then(async (category) => {
      if (category) {
        return res.status(200).json({
          data: category,
          errmsg: "",
          errno: 0,
        });
      } else {
        return res.status(404).json({
          message: "Category not found...",
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

const updateInfo = async (req: Request, res: Response) => {
  let category = req.body;
  if (category) {
    await CategoryRepository.save(category).catch((error) => {
      logger.error(NAMESPACE, error.message, error);
      return res.status(500).json({
        errmsg: error.message,
        errno: 500,
        error,
      });
    });
    return res.status(200).json({
      data: category,
      errmsg: "",
      errno: 0,
    });
  } else {
    return res.status(404).json({
      message: "Category not found...",
    });
  }
};

const uploadImage = async (req: Request, res: Response) => {
  let imgData = req.body;
  console.log(imgData);
  return res.send(imgData);
};

const deleteCategory = async (req: Request, res: Response) => {
  let { id } = req.body;

  try {
    const result = await categoryDelete(id);
    if (result.affected !== 0) {
      return res.json({ errmsg: "", errno: 0 });
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

const updateCategorySort = async (req: Request, res: Response) => {
  let { id, sort } = req.body;
  try {
    const result = await categoryUpdateById(id, { sort_order: sort });
    if (result.affected !== 0) {
      return res.json(result);
    } else {
      return res.status(404).json({
        message: "Updated failed, category not found...",
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

const getParentCategoryList = async (req: Request, res: Response) => {
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
      category.label = category.name;
      category.value = category.id;
      category.children = category.childs;
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

    categoryList.forEach((category) => {
      category.is_category =
        category.is_category === 1 ? (category.is_category = true) : (category.is_category = false);
      category.is_channel =
        category.is_channel === 1 ? (category.is_channel = true) : (category.is_channel = false);
      category.is_show =
        category.is_show === 1 ? (category.is_show = true) : (category.is_show = false);
    });
    return res.send({ data: categoryList, errmsg: "", errno: 0 });
  } catch (error: any) {
    logger.error(NAMESPACE, error.message, error);
    return res.status(500).json({ errmsg: error.message, errno: 500, error });
  }
};

export default {
  getAllCategories,
  updateStatus,
  getInfo,
  updateInfo,
  uploadImage,
  deleteCategory,
  updateCategorySort,
  getParentCategoryList,
};
