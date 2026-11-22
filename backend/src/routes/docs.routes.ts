import { Router, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";

const router = Router();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Manoa Marketplace API",
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

router.get("/swagger.json", (_req, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  return res.json(swaggerSpec);
});

export default router;
