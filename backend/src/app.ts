import express, { Application } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import purchaseRoutes from "./routes/purchase.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import artisanOrderRoutes from "./routes/artisan-order.routes";
import reviewRoutes from "./routes/review.routes";
import cartRoutes from "./routes/cart.routes";
import multer from "multer";
import dashboardRoutes from "./routes/dashboard.routes";
import docsRoutes from "./routes/docs.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "api online" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/artisan/orders", artisanOrderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/cart", cartRoutes);
app.use("/admin/dashboard", dashboardRoutes);
app.use("/docs", docsRoutes);

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "A imagem deve ter no máximo 5 MB." });
    }
    return res.status(400).json({ error: "Erro ao processar o upload da imagem." });
  }

  return next(error);
});

export default app;
