import type { Request, Response } from "express";
import type { CreateUserUseCase } from "../application/CreateUserUseCase.js";
import type { UpdateUsernameUseCase } from "../application/UpdateUsernameUseCase.js";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUsernameUseCase: UpdateUsernameUseCase,
  ) {}

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.createUserUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async updateUsername(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.updateUsernameUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
