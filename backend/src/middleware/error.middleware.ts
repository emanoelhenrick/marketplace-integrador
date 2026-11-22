import { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";

import {
  BusinessError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/business-error";

export const asyncHandler =
  <TRequest extends Request = Request>(
    handler: (req: TRequest, res: Response, next: NextFunction) => Promise<unknown>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(handler(req as TRequest, res, next)).catch(next);
  };

export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({
    error: "Endpoint não encontrado.",
    path: req.originalUrl,
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "A imagem deve ter no máximo 5 MB." });
    }

    return res.status(400).json({ error: "Erro ao processar o upload da imagem." });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(401).json({ error: error.message });
  }

  if (error instanceof ForbiddenError) {
    return res.status(403).json({ error: error.message });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }

  if (error instanceof BusinessError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof SyntaxError) {
    return res.status(400).json({ error: "JSON inválido na requisição." });
  }

  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor." });
}
