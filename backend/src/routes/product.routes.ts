import { Router, Request, Response } from "express";
import multer from "multer";

import {
  CreateProductDto,
  StatusUpdateDto,
  StockUpdateDto,
  UpdateProductDto,
} from "../dto/product.dto";
import { NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";
import { ProductService } from "../services/product.service";
import { ReviewService } from "../services/review.service";

const router = Router();
const productService = new ProductService();
const reviewService = new ReviewService();
const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(await productService.list(req.query));
  })
);

router.get(
  "/mine",
  authMiddleware,
  requireRole("artisan"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    return res.status(200).json(await productService.listByArtisan(req.user!));
  })
);

router.get(
  "/:id/reviews",
  asyncHandler(async (req: Request, res: Response) => {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }
    return res.status(200).json(await reviewService.listByProduct(productId));
  })
);

router.post(
  "/:id/reviews",
  authMiddleware,
  requireRole("client"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new NotFoundError("Produto não encontrado.");
    }
    const result = await reviewService.create(req.user!, productId, req.body);
    return res.status(201).json(result);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json(
      await productService.getPublicById(req.params.id)
    );
  })
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("artisan"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await productService.update(
      req.user!,
      req.params.id,
      req.body as UpdateProductDto
    );
    return res.status(200).json(result);
  })
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("artisan"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await productService.updateStatus(
      req.user!,
      req.params.id,
      req.body as StatusUpdateDto
    );
    return res.status(200).json(result);
  })
);

router.patch(
  "/:id/stock",
  authMiddleware,
  requireRole("artisan"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await productService.updateStock(
      req.user!,
      req.params.id,
      req.body as StockUpdateDto
    );
    return res.status(200).json(result);
  })
);

router.get(
  "/:id/stock",
  authMiddleware,
  requireRole("artisan"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await productService.getStock(req.user!, req.params.id);
    return res.status(200).json(result);
  })
);

router.post(
  "/",
  authMiddleware,
  requireRole("artisan"),
  uploadProductImage.single("image"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
    const result = await productService.create(
      req.user!,
      req.body as CreateProductDto,
      req.file
    );
    return res.status(201).json(result);
  })
);

export default router;
