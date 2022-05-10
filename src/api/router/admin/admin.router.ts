import express from "express";
import adminController from "../../controller/admin/admin.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();
// router.use(authMiddleWare.validateToken);

// router.get("/auth", adminController.validateToken);

router.get("/admin/showset", authMiddleWare.validateToken, adminController.getShowSet);

router.post("/auth/login", adminController.login);
router.post("/admin/showsetStore", authMiddleWare.validateToken, adminController.updateShowset);
router.post("/admin/adminAdd", authMiddleWare.validateToken, adminController.register);
router.post("/admin/adminDetail", authMiddleWare.validateToken, adminController.getAdminDetail);

router.post("/admin/deleAdmin", authMiddleWare.validateToken, adminController.deleteAdmin);
router.post("/admin/adminSave", authMiddleWare.validateToken, adminController.updateAdmin);

router.get("/admin", authMiddleWare.validateToken, adminController.getAllAdmins);

export default { router };
