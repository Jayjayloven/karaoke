import type { QueueSongUseCase } from "../application/QueueSongUseCase.js";
import type { Request, Response } from "express";

export class SongQueueController {
  constructor(private readonly queueSongUseCase: QueueSongUseCase) {}

  public async queueSong(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.queueSongUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
