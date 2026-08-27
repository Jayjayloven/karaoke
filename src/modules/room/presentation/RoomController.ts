import type { Request, Response } from "express";
import type { CreateRoomReq } from "../models/RoomDTO.js";
import type { CreateRoomUseCase } from "../application/CreateRoomUseCase.js";

export class RoomController {
  constructor(private createRoomUseCase: CreateRoomUseCase) {}

  public async createRoom(
    req: Request<any, any, CreateRoomReq>,
    res: Response,
  ): Promise<void> {
    try {
      const result = await this.createRoomUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
