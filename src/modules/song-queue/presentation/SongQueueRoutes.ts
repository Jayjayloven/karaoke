import { Router } from "express";
import { SongQueueController } from "./SongQueueController.js";
import { queueSongUseCase } from "../../../shared/core/dependencies.js";

const router = Router();

const songQueueController = new SongQueueController(queueSongUseCase);

/**
 * @swagger
 * /sonq-queue:
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
 *                 type: number
 *                 example: 1
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
router.post("/rooms", (req, res) => songQueueController.queueSong(req, res));
