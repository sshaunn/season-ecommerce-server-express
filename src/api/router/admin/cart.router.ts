import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import cartController from "../../controller/admin/cart.controller";

const router = express.Router();
router.use(authMiddleWare.validateToken);

router.get("/shopcart", cartController.getAllCartItems);

export default { router };
