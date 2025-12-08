import { verifyJWT } from "../middlewares/auth.middleware";

import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getLowStockProducts,
  getProductById,
  getProductCount,
} from "../controllers/product.controller";

const router = Router();
router.use(verifyJWT);
router
  .route("/add-product")
  .post(upload.single("image"), verifyAdmin, addProduct);
router.route("/delete-product").post(verifyAdmin, deleteProduct);
router.route("/all-products").get(getAllProducts);
router.route("/:productId").get(getProductById);
router.route("/product-count").get(verifyAdmin, getProductCount);
router.route("/product-low").get(verifyAdmin, getLowStockProducts);

export default router;
