import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import {
  cancelOrder,
  confirmOrder,
  getAllOrderCountByStatus,
  getAllOrderList,
  getOrderDetail,
  getOrderGoodsList,
  submitOrder,
} from "../../controller/client/order_au.controller";

const router = express.Router();

router.use(authMiddleWare.validateToken);

router.get("/order_au/list", getAllOrderList);
router.get("/order_au/orderCount", getAllOrderCountByStatus);
router.get("/order_au/detail", getOrderDetail);
router.get("/order_au/orderGoods", getOrderGoodsList);

router.post("/order_au/submit", submitOrder);
router.post("/order_au/cancel", cancelOrder);
router.post("/order_au/uploadScreenshot", confirmOrder);

export default { router };
