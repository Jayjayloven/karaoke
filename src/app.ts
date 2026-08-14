import express from "express";
import { roomRouter } from "./modules/room/presentation/RoomRoutes.js";

const app = express();

// Global middleware to parse JSON bodies
app.use(express.json());

// Mount the room feature router under an API prefix
app.use("/api", roomRouter);

// Global health check route
app.get("/", (req, res) => {
  res.send("Karaoke App API is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
