import type { Request, Response } from "express";
import type { CreateRoomUseCase } from "../application/CreateRoomUseCase.js";
import type { DeleteRoomUseCase } from "../application/DeleteRoomUseCase.js";
import type { JoinRoomUseCase } from "../application/JoinRoomUseCase.js";
import type { LeaveRoomUseCase } from "../application/LeaveRoomUseCase.js";

export class RoomController {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
    private readonly joinRoomUseCase: JoinRoomUseCase,
    private readonly leaveRoomUseCase: LeaveRoomUseCase,
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

  public async joinRoom(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.joinRoomUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async leaveRoom(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.leaveRoomUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
