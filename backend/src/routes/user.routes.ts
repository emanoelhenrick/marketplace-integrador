import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

export default router;
