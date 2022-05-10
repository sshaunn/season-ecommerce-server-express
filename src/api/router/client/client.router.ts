import express from "express";
import clientController from "../../controller/client/client.controller";

const router = express.Router();

router.post("/auth/loginByWeixin", clientController.clientLogin);

export default { router };
