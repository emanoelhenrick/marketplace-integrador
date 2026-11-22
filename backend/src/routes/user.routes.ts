import { Router, Request, Response } from "express";
import multer from "multer";
import { prisma } from "../prisma";
import { UpdateArtisanProfileDto } from "../dto/artisan-profile.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { ArtisanProfileService } from "../services/artisan-profile.service";

const router = Router();
const artisanProfileService = new ArtisanProfileService();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", authMiddleware, requireRole("admin"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        location: true,
        craft: true,
        culturalSeal: true,
        active: true,
      },
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("admin"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const active = req.body?.active;

      if (typeof active !== "boolean") {
        return res.status(400).json({
          error: "O campo active deve ser verdadeiro ou falso.",
        });
      }

      if (req.params.id === req.user!.id) {
        return res.status(400).json({
          error: "Um administrador não pode desativar sua própria conta.",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const updated = await prisma.user.update({
        where: { id: req.params.id },
        data: { active },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
        },
      });

      return res.json({
        message: active
          ? "Conta ativada com sucesso."
          : "Conta desativada com sucesso.",
        user: updated,
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar status da conta." });
    }
  }
);

router.get("/:id/profile", async (req: Request, res: Response) => {
  try {
    const result = await artisanProfileService.getPublicProfile(
      req.params.id,
      typeof req.query.page === "string" ? req.query.page : undefined,
      typeof req.query.limit === "string" ? req.query.limit : undefined
    );
    return res.json(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof BusinessError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro ao buscar perfil do artesão." });
  }
});

router.patch(
  "/me/profile",
  authMiddleware,
  requireRole("artisan"),
  upload.single("avatar"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = await artisanProfileService.updateProfile(
        req.user!,
        req.body as UpdateArtisanProfileDto,
        req.file
      );
      return res.json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ForbiddenError) {
        return res.status(403).json({ error: error.message });
      }
      if (error instanceof BusinessError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao atualizar perfil do artesão." });
    }
  }
);

export default router;
