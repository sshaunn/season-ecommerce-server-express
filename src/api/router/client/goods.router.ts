import express from "express";
import goodsController from "../../controller/client/goods.controller";

const router = express.Router();

router.get("/goods/count", goodsController.getGoodsCount);
router.get("/goods/detail", goodsController.getGoodsDetail);
router.get("/goods/list", goodsController.getGoodsList);

export default { router };
