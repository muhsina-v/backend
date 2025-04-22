import express from "express";
import tryCatch from "../utils/tryCatch.js";
import { tokenVerify } from "../middlewares/tokenVerify.js";
import {
  addToCart,
  getUserCart,
  removeFromCart,
  updateUserCart,
} from "../controllers/user/cartController.js";
import {
  allProducts,
  getProductById,
  getProductCategory,
} from "../controllers/publicController.js";
import {
  addToWishList,
  getUserWishList,
  removeFromWishList,
} from "../controllers/user/wishListController.js";
import {
  addOrder,
  cancelOneOrder,
  getAllOrders,
  getOneOrder,
  orderCashOnDelivery,
  orderWithStripe,
  StripeSuccess,
} from "../controllers/user/orderController.js";

const router = express.Router();

router

  // product route
  .get("/products", tryCatch(allProducts))
  .get("/product/:id", tryCatch(getProductById))
  .get("/products/category/:type", tryCatch(getProductCategory))

  // cart routes
  .post("/addcart", tokenVerify, tryCatch(addToCart))
  .get("/cart", tokenVerify, tryCatch(getUserCart))
  .post("/cart", tokenVerify, tryCatch(updateUserCart))
  .delete("/cart", tokenVerify, tryCatch(removeFromCart))

  // wishlist routes
  .get("/wishlist", tokenVerify, tryCatch(getUserWishList))
  .post("/wishlist", tokenVerify, tryCatch(addToWishList))
  .delete("/wishlist", tokenVerify, tryCatch(removeFromWishList))

  // order routes
  .post("/addOrders", tokenVerify, tryCatch(orderCashOnDelivery))
  .get("/orders", tokenVerify, tryCatch(getAllOrders))
  .get("/orders/order/:orderID", tokenVerify, tryCatch(getOneOrder))
  .post("/orders/cod", tokenVerify, tryCatch(orderCashOnDelivery)) //create new order w payment status cod
  .post("/orders/stripe/checkout", tokenVerify, tryCatch(orderWithStripe)) // create new order with stripe will provide session ID
  .patch(
    "/orders/stripe/success/:sessionID",
    tokenVerify,
    tryCatch(StripeSuccess)
  ) // success route for stripe
  .patch("/orders/cancel/:orderID", tokenVerify, tryCatch(cancelOneOrder)); // cancel one order

export default router;
