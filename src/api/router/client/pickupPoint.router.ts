import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import { getAllPickupPoints } from "../../controller/client/pickupPoint.controller";

const router = express.Router();
router.use(authMiddleWare.validateToken);

router.get("/pickup_point/getAllPickupPoints", getAllPickupPoints);

export default { router };
