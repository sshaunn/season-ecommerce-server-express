import express from "express";
import settingsController from "../../controller/client/settings.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();

// router.use(authMiddleWare.validateToken);

router.get("/settings/showSettings", settingsController.getShowSettings);
router.get("/settings/userDetail", authMiddleWare.validateToken, settingsController.getUserDetail);

router.post("/settings/save", authMiddleWare.validateToken, settingsController.saveUserDetail);

export default { router };
