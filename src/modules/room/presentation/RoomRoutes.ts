import { Router } from "express";
import { RoomController } from "./RoomController.js";
import {
  createRoomUseCase,
  deleteRoomUseCase,
  joinRoomUseCase,
  leaveRoomUseCase,
} from "../../../shared/core/dependencies.js";

const router = Router();

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
 *               - hostId
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
 * /rooms/leave:
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
