import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import indexController from "../../controller/admin/index.controller";

const router = express.Router();
// router.use(authMiddleWare.validateToken);

router.get("/index", indexController.getIndexCardsInfo);
router.get("/index/main", indexController.getIndexInfo);

export default { router };
