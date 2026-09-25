import type { QueueSongUseCase } from "../application/QueueSongUseCase.js";
import type { Request, Response } from "express";
import type { RemoveSongFromQueueUseCase } from "../application/RemoveSongFromQueueUseCase.js";

export class SongQueueController {
  constructor(
    private readonly queueSongUseCase: QueueSongUseCase,
    private readonly removeQueuedSongUseCase: RemoveSongFromQueueUseCase,
  ) {}

  public async queueSong(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.queueSongUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async removeQueuedSong(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.removeQueuedSongUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
