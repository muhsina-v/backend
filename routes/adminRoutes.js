import express from "express";
import tryCatch from "../utils/tryCatch.js";
import { adminLogin } from "../controllers/authController.js";
import { verifyTokenAdmin } from "../middlewares/tokenVerify.js";
import {
  blockUser,
  getAllUsers,
  getOneUser,
  unblockUser,
} from "../controllers/admin/adminUserController.js";

import {
  adminAllProducts,
  createProducts,
  deleteProducts,
  restoreProducts,
  updateProducts,
} from "../controllers/admin/adminProductController.js";

import {
  getOrderByUser,
  getTotalOrders,
  getTotalStats,
  totalPurchaseOfOrders,
  updatePaymentStatus,
  updateShippingStatus,
} from "../controllers/admin/adminOrderController.js";

import {
  getProductById,
  getProductCategory,
} from "../controllers/publicController.js";

const router = express.Router();

router
  .post("/login", tryCatch(adminLogin))

  .get("/users", verifyTokenAdmin, tryCatch(getAllUsers))
  .get("/user/:id", verifyTokenAdmin, tryCatch(getOneUser))
  .patch("/user/block/:id", verifyTokenAdmin, tryCatch(blockUser))
  .patch("/user/unblock/:id", verifyTokenAdmin, tryCatch(unblockUser))

  .get("/products", verifyTokenAdmin, tryCatch(adminAllProducts))
  .get("/product/:id", verifyTokenAdmin, tryCatch(getProductById))
  .get(
    "/products/category/:type",
    verifyTokenAdmin,
    tryCatch(getProductCategory)
  )
  //--
  .post("/product", verifyTokenAdmin, tryCatch(createProducts))
  .put("/product/update/:id", verifyTokenAdmin, tryCatch(updateProducts))
  .patch("/product/delete/:id", verifyTokenAdmin, tryCatch(deleteProducts))
  .patch("/product/restore/:id", verifyTokenAdmin, tryCatch(restoreProducts))

  .get("/orders", verifyTokenAdmin, tryCatch(getTotalOrders))
  .get("/orders/user/:id", verifyTokenAdmin, tryCatch(getOrderByUser))

  .get("/orders/total", verifyTokenAdmin, tryCatch(totalPurchaseOfOrders))
  .get("/orders/stats", verifyTokenAdmin, tryCatch(getTotalStats))
  .patch(
    "/orders/shipping/:id",
    verifyTokenAdmin,
    tryCatch(updateShippingStatus)
  )
  .patch(
    "/orders/payment/:id",
    verifyTokenAdmin,
    tryCatch(updatePaymentStatus)
  );

export default router;
