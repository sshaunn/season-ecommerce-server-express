import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import adController from "../../controller/admin/ad.controller";

const router = express.Router();
router.use(authMiddleWare.validateToken);

router.get("/ad", adController.getAllAds);
router.get("/ad/saleStatus", adController.updateAdSaleStatus);
router.get("/ad/info", adController.getAdInfo);

router.post("/ad/updateSort", adController.updateAdSort);
router.post("/ad/getallrelate", adController.getAllRelate);
router.post("/ad/store", adController.updateAd);
router.post("/ad/destroy", adController.deleteAd);

export default { router };
