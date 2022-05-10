import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import specificationController from "../../controller/admin/specification.controller";

const router = express.Router();
router.use(authMiddleWare.validateToken);

router.get("/specification", specificationController.getAllSpecification);
router.post("/specification/detail", specificationController.getSpecification);
router.post("/specification/update", specificationController.updateSpecification);
router.post("/specification/delete", specificationController.deleteSpecification);
router.post("/specification/getGoodsSpec", specificationController.getGoodsSpec);
router.post("/specification/add", specificationController.addSpecification);

export default { router };
