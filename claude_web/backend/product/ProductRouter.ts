import { Router } from "express";
import { ProductController } from "./ProductController";
import { validateRequest } from "../shared/middleware";
import { ProductDomain } from "../../modules/product/Product";

const router = Router();
const productController = new ProductController();

router.post(
  "/",
  validateRequest(ProductDomain.validateProduct),
  productController.createProduct
);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.put(
  "/:id",
  validateRequest(ProductDomain.validateProduct),
  productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);

export default router;