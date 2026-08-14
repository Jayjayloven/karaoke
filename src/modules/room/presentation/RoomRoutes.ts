import { Router } from "express";
import { MongoRoomRepository } from "../infrastructure/MongoRoomRepository.js";
import { RenameRoomUseCase } from "../application/RenameRoomUseCase.js";
import { RoomController } from "./RoomController.js";

const router = Router();

// 1. Instantiate the Infrastructure layer (Database Repository)
const roomRepository = new MongoRoomRepository();

// 2. Instantiate the Application layer (Use Case) and inject the repository
const renameRoomUseCase = new RenameRoomUseCase(roomRepository);

// 3. Instantiate the Presentation layer (Controller) and inject the use case
const roomController = new RoomController(renameRoomUseCase);

// 4. Define the route and bind the controller method
// Notice the .js extensions and proper REST route parameters (:id)
router.put("/rooms/:id", roomController.renameRoom);

export const roomRouter = router;
