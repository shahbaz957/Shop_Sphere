import {
  deleteOrder,
  getAllOrders,
  getOrdersByUser,
  orderProduct,
  toggleOrder,
  totalEarningAndSales,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();
router.use(verifyJWT);
router.route("/:productId").post(orderProduct)
router.route("/all-orders").get(verifyAdmin, getAllOrders);
router.route("/").get(getOrdersByUser);
router.route("/sale-earning").get(verifyAdmin, totalEarningAndSales);
router.route("/toggle-order/:orderId").post(verifyAdmin, toggleOrder);
router.route('/delete/:orderId').delete(deleteOrder)

export default router;
