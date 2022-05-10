import express from "express";
import goodsController from "../../controller/admin/goods.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleWare.validateToken);

router.get("/goods", goodsController.getAllGoods);
router.get("/goods/sort", goodsController.getAllGoods);
router.get("/goods/indexShowStatus", goodsController.updateGoodsIndexShowStatus);
router.get("/goods/saleStatus", goodsController.updateGoodsSaleStatus);
router.get("/goods/productStatus", goodsController.updateProductStatus);
router.get("/goods/getAllCategory", goodsController.getAllCategory);
router.get("/goods/getAllSpecification", goodsController.getAllSpecification);
router.get("/goods/getExpressData", goodsController.getAllExpress);
router.get("/goods/info", goodsController.getGoodsInfo);
router.get("/goods/galleryList", goodsController.getGalleryList);

router.post("/goods/destory", goodsController.deleteGoods);
router.post("/goods/deleteGalleryFile", goodsController.deleteGalleryFile);
router.post("/goods/updatePrice", goodsController.updateGoodsPrice);
router.post("/goods/updateSort", goodsController.updateSortOrder);
router.post("/goods/getGoodsSpec", goodsController.getGoodsSpec);
router.post("/goods/getGalleryList", goodsController.getGoodsGallery);
router.post("/goods/galleryEdit", goodsController.updateGallerySort);
router.post("/goods/store", goodsController.upsertGoodsInfo);
router.post("/goods/copygoods", goodsController.copyGoods);
router.post("/goods/checkSku", goodsController.checkGoodsSKU);
router.post("/goods/gallery", goodsController.addGallery);

router.get("/goods/:status", goodsController.getGoodsBy);

export default { router };
