import express from "express";
import {
  addFreightTemplate,
  deleteFreightTemplate,
  getFreightList,
  getFreightTemplateDetail,
  getRegionData,
  updateFreightTemplate,
} from "../../controller/admin/shipper.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleWare.validateToken);

router.get("/shipper/freight", getFreightList);
router.post("/shipper/getareadata", getRegionData);

router.post("/shipper/freightdetail", getFreightTemplateDetail);
router.post("/shipper/destory", deleteFreightTemplate);
router.post("/shipper/addTable", addFreightTemplate);
router.post("/shipper/saveTable", updateFreightTemplate);

export default { router };
