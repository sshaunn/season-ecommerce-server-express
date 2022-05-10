import express from "express";
import indexController from "../../controller/client/index.controller";

const router = express.Router();

// router.use(authMiddleWare.validateToken);

router.get("/index/appInfo", indexController.getAppInfo);

export default { router };
