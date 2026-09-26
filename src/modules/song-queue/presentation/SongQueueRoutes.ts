import { Router } from "express";
import { SongQueueController } from "./SongQueueController.js";
import {
  queueSongUseCase,
  removeSongFromQueueUseCase,
} from "../../../shared/core/dependencies.js";

const router = Router();

const songQueueController = new SongQueueController(
  queueSongUseCase,
  removeSongFromQueueUseCase,
);

/**
 * @swagger
 * /song-queue:
 *   post:
 *     summary: Queue a song for your karaoke room
 *     tags: [Song-Queue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roomId
 *               - songName
 *               - mediaUrl
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1"
 *               roomId:
 *                 type: integer
 *                 example: 1
 *               songName:
 *                 type: string
 *                 example: Blessed
 *               mediaUrl:
 *                 type: string
 *                 example: https://www.youtube.com/watch?v=PHQIkMih9w8&list=RDPHQIkMih9w8&start_radio=1&pp=ygUdYmxlc3NlZCBkYW5pZWwgY2Flc2FyIGthcmFva2WgBwE%3D
 *     responses:
 *       201:
 *         description: Song queued successfully
 *       400:
 *         description: Bad request
 */
router.post("/song-queue", (req, res) =>
  songQueueController.queueSong(req, res),
);

/**
 * @swagger
 * /song-queue:
 *   delete:
 *     summary: Delete a song from the queue of your karaoke room
 *     tags: [Song-Queue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roomId
 *               - songId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1"
 *               roomId:
 *                 type: integer
 *                 example: 1
 *               songId:
 *                 type: string
 *                 example:
 *     responses:
 *       201:
 *         description: Song removed successfully
 *       400:
 *         description: Bad request
 */
router.delete("/song-queue", (req, res) =>
  songQueueController.removeQueuedSong(req, res),
);

export const songQueueRouter = router;
