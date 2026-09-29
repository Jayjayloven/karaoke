import type { QueueSongUseCase } from "../application/QueueSongUseCase.js";
import type { Request, Response } from "express";
import type { RemoveSongFromQueueUseCase } from "../application/RemoveSongFromQueueUseCase.js";
import type { EditQueuedSongUseCase } from "../application/EditQueuedSongUseCase.js";

export class SongQueueController {
  constructor(
    private readonly queueSongUseCase: QueueSongUseCase,
    private readonly removeQueuedSongUseCase: RemoveSongFromQueueUseCase,
    private readonly editQueuedSongUseCase: EditQueuedSongUseCase,
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

  public async editQueuedSong(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.editQueuedSongUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
