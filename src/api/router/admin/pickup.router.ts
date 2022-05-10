import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import pickupController from "../../controller/admin/pickup.controller";

const router = express.Router();
router.use(authMiddleWare.validateToken);

router.get("/pickup_point/getAllPickupPoints", pickupController.getAllPickupPoint);
router.post("/pickup_point/getPickupPoint", pickupController.getPickupPoint);
router.post("/pickup_point/updatePickupPoint", pickupController.updatePickupPoint);
router.post("/pickup_point/createPickupPoint", pickupController.addPickupPoint);
router.post("/pickup_point/deletePickupPoint", pickupController.deletePickupPoint);

export default { router };
