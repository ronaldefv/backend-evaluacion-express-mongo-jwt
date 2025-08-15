
import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";
import cache from "../middleware/cache.js";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = Router();
router.get("/", authenticate, cache(10000), listProducts);
router.get("/:id", authenticate, cache(10000), getProduct);
router.post("/", authenticate, authorize("admin"), createProduct);
router.put("/:id", authenticate, authorize("admin"), updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);
export default router;
