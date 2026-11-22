import { Router, Request, Response } from "express";
import multer from "multer";
import { prisma } from "../prisma";
import { UpdateArtisanProfileDto } from "../dto/artisan-profile.dto";
import { BusinessError, ForbiddenError, NotFoundError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { ArtisanProfileService } from "../services/artisan-profile.service";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();
const artisanProfileService = new ArtisanProfileService();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", authMiddleware, requireRole("admin"), asyncHandler<AuthenticatedRequest>(async (req, res) => {
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
}));

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("admin"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
      const active = req.body?.active;

      if (typeof active !== "boolean") {
        throw new BusinessError("O campo active deve ser verdadeiro ou falso.");
      }

      if (req.params.id === req.user!.id) {
        throw new BusinessError("Um administrador não pode desativar sua própria conta.");
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
        throw new NotFoundError("Usuário não encontrado.");
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
  })
);

router.get("/:id/profile", asyncHandler(async (req: Request, res: Response) => {
    const result = await artisanProfileService.getPublicProfile(
      req.params.id,
      typeof req.query.page === "string" ? req.query.page : undefined,
      typeof req.query.limit === "string" ? req.query.limit : undefined
    );
    return res.json(result);
}));

router.patch(
  "/me/profile",
  authMiddleware,
  requireRole("artisan"),
  upload.single("avatar"),
  asyncHandler<AuthenticatedRequest>(async (req, res) => {
      const result = await artisanProfileService.updateProfile(
        req.user!,
        req.body as UpdateArtisanProfileDto,
        req.file
      );
      return res.json(result);
  })
);

export default router;
