import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getAllProductsFromCart,
  addToCart,
  deleteFromCart,
} from "../controllers/cart.controller";
const router = Router();

router.use(verifyJWT);
router.route("/all-cart").get(getAllProductsFromCart);
router.route("/add-cart/:productId").post(addToCart);
router.route("/delete-cart/:productId").delete(deleteFromCart);

export default router;
