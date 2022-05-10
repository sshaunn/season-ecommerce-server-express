import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import uploadController from "../../controller/admin/upload.controller";

const router = express.Router();

router.use(authMiddleWare.validateToken);

router.post("/upload/upload", uploadController.uploadImage);

export default { router };
