// src/shared/core/dependencies.ts
import { dbPool } from "./postgres.js";

import { RoomRepository } from "../../modules/room/infrastructure/RoomRepository.js";
import { WebSocketConnectionManager } from "./WebSocketConnectionManager.js";
import { LeaveRoomUseCase } from "../../modules/room/application/LeaveRoomUseCase.js";
import { CreateRoomUseCase } from "../../modules/room/application/CreateRoomUseCase.js";
import { DeleteRoomUseCase } from "../../modules/room/application/DeleteRoomUseCase.js";
import { JoinRoomUseCase } from "../../modules/room/application/JoinRoomUseCase.js";
import { UserRepository } from "../../modules/user/infrastructure/UserRepository.js";

// Infrastructure
export const userRepository = new UserRepository(dbPool);
export const roomRepository = new RoomRepository(dbPool);
export const webSocketManager = new WebSocketConnectionManager();

// Application Layer
export const createRoomUseCase = new CreateRoomUseCase(
  roomRepository,
  userRepository,
  webSocketManager,
);
export const deleteRoomUseCase = new DeleteRoomUseCase(
  roomRepository,
  userRepository,
  webSocketManager,
);
export const joinRoomUseCase = new JoinRoomUseCase(
  roomRepository,
  userRepository,
  webSocketManager,
);
export const leaveRoomUseCase = new LeaveRoomUseCase(
  roomRepository,
  userRepository,
  webSocketManager,
);
