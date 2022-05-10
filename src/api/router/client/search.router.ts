import express from "express";
import { searchIndex } from "../../controller/client/search.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();

// router.use(authMiddleWare.validateToken);

router.get("/search/index", searchIndex);

export default { router };
