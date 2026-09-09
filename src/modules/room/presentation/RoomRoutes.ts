import { Router } from "express";
import { RoomRepository } from "../infrastructure/RoomRepository.js";
import { CreateRoomUseCase } from "../application/CreateRoomUseCase.js";
import { dbPool } from "../../../shared/core/postgress.js";
import { RoomController } from "./RoomController.js";

const router = Router();

const roomRepository = new RoomRepository(dbPool);

const createRoomUseCase = new CreateRoomUseCase(roomRepository);

const roomController = new RoomController(createRoomUseCase);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new karaoke room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomName
 *               - hostId
 *             properties:
 *               roomName:
 *                 type: string
 *                 example: "Friday Night Jams"
 *               hostId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Bad request
 */
router.post("/rooms", (req, res) => roomController.createRoom(req, res));

export const roomRouter = router;
