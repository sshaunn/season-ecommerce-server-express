import express from "express";
import addressAUController from "../../controller/client/address_au.controller";
import authMiddleWare from "../../middleware/auth.middleware";

const router = express.Router();

router.use(authMiddleWare.validateToken);

router.get("/address_au/getAddresses", addressAUController.getAddressList);
router.get("/address_au/addressDetail", addressAUController.getAddressDetail);

router.post("/address_au/addAddress", addressAUController.addAddress);
router.post("/address_au/updateAddress", addressAUController.updateAddressDetail);
router.post("/address_au/deleteAddress", addressAUController.deleteAddress);

export default { router };
