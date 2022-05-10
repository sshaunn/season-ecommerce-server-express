import express from "express";
import admin from "./admin/admin.router";
import adminCategory from "./admin/category.router";
import adminSpecification from "./admin/specification.router";
import adminIndex from "./admin/index.router";
import adminCart from "./admin/cart.router";
import adminUser from "./admin/user.router";
import adminOrder from "./admin/order.router";
import adminGoods from "./admin/goods.router";
import adminUpload from "./admin/upload.router";
import adminAds from "./admin/ad.router";
import adminPickup from "./admin/pickup.router";
import adminOrderAU from "./admin/order_au.router";
import adminShipper from "./admin/shipper.router";
/**------------------client import-------------------------------- */
import clientIndex from "./client/index.router";
import clientGoods from "./client/goods.router";
import client from "./client/client.router";
import clientCart from "./client/cart.router";
import clientSettings from "./client/setting.router";
import clientCatalog from "./client/catalog.router";
import clientAddress from "./client/address_au.router";
import clientOrderAU from "./client/order_au.router";
import clientFileUpload from "./client/fileupload.router";
import clientSearch from "./client/search.router";
import clientPickupPoint from "./client/pickupPoint.router";

const router = express.Router();

/**----------------------client api routes------------------------- */
router.use("/api", clientIndex.router);
router.use("/api", clientGoods.router);
router.use("/api", client.router);
router.use("/api", clientCart.router);
router.use("/api", clientSettings.router);
router.use("/api", clientCatalog.router);
router.use("/api", clientAddress.router);
router.use("/api", clientOrderAU.router);
router.use("/api", clientFileUpload.router);
router.use("/api", clientSearch.router);
router.use("/api", clientPickupPoint.router);
/** ----------------------admin api routes-------------------------- */

router.use("/admin", admin.router);
router.use("/admin", adminCategory.router);
router.use("/admin", adminSpecification.router);
router.use("/admin", adminIndex.router);
router.use("/admin", adminCart.router);
router.use("/admin", adminUser.router);
router.use("/admin/", adminOrder.router);
router.use("/admin", adminGoods.router);
router.use("/admin", adminUpload.router);
router.use("/admin", adminAds.router);
router.use("/admin", adminPickup.router);
router.use("/admin", adminOrderAU.router);
router.use("/admin", adminShipper.router);

// router.post("/admin/auth/login", adminController.login);

export default { router };
