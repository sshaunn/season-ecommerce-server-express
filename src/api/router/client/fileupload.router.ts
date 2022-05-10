import express from "express";
import authMiddleWare from "../../middleware/auth.middleware";
import { uploadUserProfileImage } from "../../controller/fileUpload.controller";

const router = express.Router();
router.use(authMiddleWare.validateToken);

router.post("/fileUpload/upload", uploadUserProfileImage);

export default { router };
