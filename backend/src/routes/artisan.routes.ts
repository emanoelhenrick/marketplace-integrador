import { Router, Request, Response } from "express";
import { ArtisanService } from "../services/artisan.service";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();
const artisanService = new ArtisanService();

router.get("/", asyncHandler(async (req: Request, res: Response) => {
    const artisans = await artisanService.list({
      craft: typeof req.query.craft === "string" ? req.query.craft.trim() : undefined,
      location:
        typeof req.query.location === "string" ? req.query.location.trim() : undefined,
      region: typeof req.query.region === "string" ? req.query.region.trim() : undefined,
    });

    return res.status(200).json(artisans);
}));

router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
    const artisan = await artisanService.getById(req.params.id);
    return res.status(200).json(artisan);
}));

router.get("/:id/products", asyncHandler(async (req: Request, res: Response) => {
    const page =
      typeof req.query.page === "string" ? req.query.page : undefined;
    const limit =
      typeof req.query.limit === "string" ? req.query.limit : undefined;

    const result = await artisanService.getProducts(
      req.params.id,
      page,
      limit
    );

    return res.status(200).json(result);
}));

export default router;
