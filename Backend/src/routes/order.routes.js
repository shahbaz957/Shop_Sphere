import {
  deleteOrder,
  getAllOrders,
  getOrdersByUser,
  orderProduct,
  toggleOrder,
  totalEarningAndSales,
} from "../controllers/order.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";

const router = Router();
router.use(verifyJWT);
router.route("/order/:productId").post(orderProduct).delete(deleteOrder);
router.route("/all-orders").get(verifyAdmin, getAllOrders);
router.route("/order").get(getOrdersByUser);
router.route("/order/sale-earning").get(verifyAdmin, totalEarningAndSales);
router.route("/toggle-order/:productId").post(verifyAdmin, toggleOrder);

export default router;
