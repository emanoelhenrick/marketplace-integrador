import express, { Application } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "api online" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;
