import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import categoryController from "../../controller/admin/category.controller";

const router = express.Router();
router.use(authMiddleWare.validateToken);

router.get("/category", categoryController.getAllCategories);
router.get("/category/topCategory", categoryController.getAllCategories);
router.get("/category/info?", categoryController.getInfo);
router.get("/category/getParentCategory", categoryController.getParentCategoryList);

router.post("/category/store", categoryController.updateInfo);
router.post("/category/upload", categoryController.uploadImage);
router.post("/category/destory", categoryController.deleteCategory);
router.post("/category/updateSort", categoryController.updateCategorySort);

router.get("/category/:url", categoryController.updateStatus);
export default { router };
