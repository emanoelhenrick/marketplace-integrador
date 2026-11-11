import express, { Application } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import purchaseRoutes from "./routes/purchase.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import artisanOrderRoutes from "./routes/artisan-order.routes";

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

export default app;
