import { Router, Response } from "express";
import { BusinessError } from "../errors/business-error";
import { authMiddleware, AuthenticatedRequest, requireRole } from "../middleware/auth.middleware";
import { DashboardService } from "../services/dashboard.service";

const router = Router();
const dashboardService = new DashboardService();

router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const startDate =
        typeof req.query.startDate === "string" ? req.query.startDate : undefined;
      const endDate =
        typeof req.query.endDate === "string" ? req.query.endDate : undefined;

      const result = await dashboardService.getIndicators({
        startDate,
        endDate,
      });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof BusinessError) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Erro ao calcular indicadores." });
    }
  }
);

export default router;
