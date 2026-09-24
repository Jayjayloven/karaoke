// src/shared/core/dependencies.ts
import { dbPool } from "./postgres.js";

import { RoomRepository } from "../../modules/room/infrastructure/RoomRepository.js";
import { WebSocketConnectionManager } from "./WebSocketConnectionManager.js";
import { LeaveRoomUseCase } from "../../modules/room/application/LeaveRoomUseCase.js";
import { CreateRoomUseCase } from "../../modules/room/application/CreateRoomUseCase.js";
import { DeleteRoomUseCase } from "../../modules/room/application/DeleteRoomUseCase.js";
import { JoinRoomUseCase } from "../../modules/room/application/JoinRoomUseCase.js";
import { UserRepository } from "../../modules/user/infrastructure/UserRepository.js";
import { CreateUserUseCase } from "../../modules/user/application/CreateUserUseCase.js";
import { UpdateUsernameUseCase } from "../../modules/user/application/UpdateUsernameUseCase.js";
import { SongQueueRepository } from "../../modules/song-queue/repository/SongQueueRepository.js";
import { QueueSongUseCase } from "../../modules/song-queue/application/QueueSongUseCase.js";

// Infrastructure
export const roomRepository = new RoomRepository(dbPool);
export const songQueueRepository = new SongQueueRepository(dbPool);
export const userRepository = new UserRepository(dbPool);
export const webSocketManager = new WebSocketConnectionManager();

// Room Use Cases
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

// Song Queue Use Cases
export const queueSongUseCase = new QueueSongUseCase(
  songQueueRepository,
  userRepository,
  roomRepository,
  webSocketManager,
);

// User Use Cases
export const createUserUseCase = new CreateUserUseCase(userRepository);
export const updateUsernameUseCase = new UpdateUsernameUseCase(userRepository);
