import { Router } from "express";
import { RoomRepository } from "../infrastructure/RoomRepository.js";
import { CreateRoomUseCase } from "../application/CreateRoomUseCase.js";
import { dbPool } from "../../../shared/core/postgres.js";
import { RoomController } from "./RoomController.js";
import { DeleteRoomUseCase } from "../application/DeleteRoomUseCase.js";
import { JoinRoomUseCase } from "../application/JoinRoomUseCase.js";
import { LeaveRoomUseCase } from "../application/LeaveRoomUseCase.js";

const router = Router();

const roomRepository = new RoomRepository(dbPool);

const createRoomUseCase = new CreateRoomUseCase(roomRepository);
const deleteRoomUseCase = new DeleteRoomUseCase(roomRepository);
const joinRoomUseCase = new JoinRoomUseCase(roomRepository);
const leaveRoomUseCase = new LeaveRoomUseCase(roomRepository, userRepository); 
// TODO: create userRepository and a dependency injection file for all the useCases

const roomController = new RoomController(
  createRoomUseCase,
  deleteRoomUseCase,
  joinRoomUseCase,
  leaveRoomUseCase,
);

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

/**
 * @swagger
 * /rooms:
 *   delete:
 *     summary: Delete a karaoke room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - userId
 *             properties:
 *               roomId:
 *                 type: integer
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Room deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete("/rooms", (req, res) => roomController.deleteRoom(req, res));

/**
 * @swagger
 * /rooms:
 *   patch:
 *     summary: Join a karaoke room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roomId
 *               - roomCode
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               roomId:
 *                 type: integer
 *                 example: 1
 *               roomCode:
 *                  type: string
 *                  example: "CODE"
 *     responses:
 *       201:
 *         description: Room deleted successfully
 *       400:
 *         description: Bad request
 */
router.patch("/rooms", (req, res) => roomController.joinRoom(req, res));

/**
 * @swagger
 * /rooms:
 *   patch:
 *     summary: Leave a karaoke room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roomId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               roomId:
 *                 type: integer
 *                 example: 1

 *     responses:
 *       201:
 *         description: Room deleted successfully
 *       400:
 *         description: Bad request
 */
router.patch("/rooms/leave", (req, res) => roomController.leaveRoom(req, res));

export const roomRouter = router;
