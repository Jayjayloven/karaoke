// src/app.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import { roomRouter } from "./modules/room/presentation/RoomRoutes.js";
import { swaggerSpec } from "./shared/core/swagger.js";
import { userRouter } from "./modules/user/presentation/UserRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", roomRouter);
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Karaoke App API is running!");
});

export default app;
