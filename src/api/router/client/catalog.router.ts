import express from "express";
import catalogController from "../../controller/client/catalog.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/catalog/index", catalogController.getCatalogIndex);
router.get("/catalog/current", catalogController.getCurrent);

router.post("/catalog/currentList", catalogController.getCurrentList);

export default { router };
