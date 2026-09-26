// src/app.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import { roomRouter } from "./modules/room/presentation/RoomRoutes.js";
import { swaggerSpec } from "./shared/core/swagger.js";
import { userRouter } from "./modules/user/presentation/UserRoutes.js";
import cors from "cors";
import { songQueueRouter } from "./modules/song-queue/presentation/SongQueueRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

// Middleware
app.use(express.json());

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", roomRouter);
app.use("/api", userRouter);
app.use("/api", songQueueRouter);

app.get("/", (req, res) => {
  res.send("Karaoke App API is running!");
});

export default app;
