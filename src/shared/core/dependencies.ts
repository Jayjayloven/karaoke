// src/shared/core/dependencies.ts
import { dbPool } from "./postgres.js";

import { UserRepository } from "../../modules/user/infrastructure/UserRepository.js";
import { RoomRepository } from "../../modules/room/infrastructure/RoomRepository.js";
import { WebSocketConnectionManager } from "../../modules/room/infrastructure/WebSocketConnectionManager.js";
import { LeaveRoomUseCase } from "../../modules/room/application/LeaveRoomUseCase.js";

// Infrastructure
export const userRepository = new UserRepository(dbPool);
export const roomRepository = new RoomRepository(dbPool);
export const webSocketManager = new WebSocketConnectionManager();

// Application Layer
export const leaveRoomUseCase = new LeaveRoomUseCase(
  roomRepository,
  userRepository,
);
