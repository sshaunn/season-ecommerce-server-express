import express from "express";
import orderController from "../../controller/admin/order.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleWare.validateToken);

// router.put("/order_au/updateOrder", orderController.getOrderDetail);
// router.put("/order_au/updateOrder", orderController.updateOrderStatus);
// router.post("/order_au/updateOrder", orderController.updateOrderStatus);

router.get("/order/getAllRegion", orderController.getAllRegion);
// router.get("/order_au", orderController.getAllOrders);
// router.get("/order_au/detail", orderController.getOrderDetail);

export default { router };
