import express from "express";
import userController from "../../controller/admin/user.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleWare.validateToken);

router.get("/user?", userController.getAllUsers);
router.get("/user/info", userController.getUserInfo);
router.get("/user/datainfo", userController.getUserActionInfo);
router.get("/user/order", userController.getUserOrderAUInfo);
router.get("/user/address", userController.getUserAddress);
router.get("/user/cartdata", userController.getUserCarts);
router.get("/user/foot", userController.getUserFootprint);

router.post("/user/updateInfo", userController.updateUserNickname);
router.post("/user/updateName", userController.updateUserName);
router.post("/user/updateMobile", userController.updateUserPhonenumber);
router.post("/user/saveAddress", userController.updateUserAddress);

export default { router };
