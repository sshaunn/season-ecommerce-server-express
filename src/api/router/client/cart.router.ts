import express from "express";
import cartController from "../../controller/client/cart.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();
// router.use(authMiddleWare.validateToken);

router.get("/cart/index", authMiddleWare.validateToken, cartController.getCartIndexInfo);
router.get("/cart/goodsCount", authMiddleWare.validateToken, cartController.getGoodsCount);

router.post("/cart/update", authMiddleWare.validateToken, cartController.updateCartGoodsNumber);
router.post("/cart/delete", authMiddleWare.validateToken, cartController.deleteCartItem);
router.post("/cart/checked", authMiddleWare.validateToken, cartController.updateCartCheckedStatus);
router.post("/cart/add", authMiddleWare.validateToken, cartController.addCartItem);
router.get("/cart/checkout", authMiddleWare.validateToken, cartController.checkoutCartItems);

export default { router };
