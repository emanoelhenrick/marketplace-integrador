import { Router, Request, Response } from "express";
import { NotFoundError } from "../errors/business-error";
import { ArtisanService } from "../services/artisan.service";

const router = Router();
const artisanService = new ArtisanService();

router.get("/", async (req: Request, res: Response) => {
  try {
    const artisans = await artisanService.list({
      craft: typeof req.query.craft === "string" ? req.query.craft.trim() : undefined,
      location:
        typeof req.query.location === "string" ? req.query.location.trim() : undefined,
      region: typeof req.query.region === "string" ? req.query.region.trim() : undefined,
    });

    return res.status(200).json(artisans);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar artesãos." });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const artisan = await artisanService.getById(req.params.id);
    return res.status(200).json(artisan);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao buscar artesão." });
  }
});

export default router;
