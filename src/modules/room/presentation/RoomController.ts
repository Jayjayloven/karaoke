import type { Request, Response } from "express";
import type { CreateRoomReq, DeleteRoomReq } from "../models/RoomDTO.js";
import type { CreateRoomUseCase } from "../application/CreateRoomUseCase.js";
import type { DeleteRoomUseCase } from "../application/DeleteRoomUseCase.js";

export class RoomController {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
  ) {}

  public async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.createRoomUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.deleteRoomUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
