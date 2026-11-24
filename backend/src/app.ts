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
import dashboardRoutes from "./routes/dashboard.routes";
import docsRoutes from "./routes/docs.routes";
import artisanRoutes from "./routes/artisan.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import recommendationRoutes from "./routes/recommendation.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "online" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/artisan/orders", artisanOrderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/cart", cartRoutes);
app.use("/admin/dashboard", dashboardRoutes);
app.use("/artisans", artisanRoutes);
app.use("/docs", docsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
