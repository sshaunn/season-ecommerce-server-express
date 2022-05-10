import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import orderAUController from "../../controller/admin/order_au.controller";

const router = express.Router();

router.use(authMiddleWare.validateToken);

router.get("/order_au", orderAUController.getOrderAUIndex);
router.get("/order_au/detail", orderAUController.getOrderAUDetail);

router.put("/order_au/updateOrder", orderAUController.updateOrder);

export default { router };
