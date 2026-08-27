import { Router } from "express";
import { RoomRepository } from "../infrastructure/RoomRepository.js";
import { CreateRoomUseCase } from "../application/CreateRoomUseCase.js";
import { dbPool } from "../../../shared/core/postgress.js";
import { RoomController } from "./RoomController.js";

const router = Router();

const roomRepository = new RoomRepository(dbPool);

const createRoomUseCase = new CreateRoomUseCase(roomRepository);

const roomController = new RoomController(createRoomUseCase);

router.post("/rooms", roomController.createRoom);

export const roomRouter = router;
