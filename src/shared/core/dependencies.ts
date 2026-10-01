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
import { SongQueueRepository } from "../../modules/song-queue/infrastructure/SongQueueRepository.js";
import { QueueSongUseCase } from "../../modules/song-queue/application/QueueSongUseCase.js";
import { RequestValidators } from "../RequestValidators.js";
import { RemoveSongFromQueueUseCase } from "../../modules/song-queue/application/RemoveSongFromQueueUseCase.js";
import { EditQueuedSongUseCase } from "../../modules/song-queue/application/EditQueuedSongUseCase.js";
import { GetRoomSongQueueUseCase } from "../../modules/room/application/GetRoomSongQueueUseCase.js";
import { GetUsersInRoomUseCase } from "../../modules/room/application/GetUsersInRoomUseCase.js";
import { KickUserUseCase } from "../../modules/room/application/KickUserUseCase.js";

// Infrastructure
export const roomRepository = new RoomRepository(dbPool);
export const songQueueRepository = new SongQueueRepository(dbPool);
export const userRepository = new UserRepository(dbPool);
export const webSocketManager = new WebSocketConnectionManager();

// Validator
export const requestValidators = new RequestValidators(
  songQueueRepository,
  userRepository,
  roomRepository,
);

// Room Use Cases
export const createRoomUseCase = new CreateRoomUseCase(
  roomRepository,
  userRepository,
  requestValidators,
);
export const getRoomSongQueueUseCase = new GetRoomSongQueueUseCase(
  songQueueRepository,
  requestValidators,
);
export const getUsersInRoomUseCase = new GetUsersInRoomUseCase(
  roomRepository,
  userRepository,
  requestValidators,
);
export const kickUserUseCase = new KickUserUseCase(
  userRepository,
  requestValidators,
  webSocketManager,
);
export const deleteRoomUseCase = new DeleteRoomUseCase(
  roomRepository,
  userRepository,
  webSocketManager,
  requestValidators,
);
export const joinRoomUseCase = new JoinRoomUseCase(
  roomRepository,
  userRepository,
  webSocketManager,
  requestValidators,
);
export const leaveRoomUseCase = new LeaveRoomUseCase(
  roomRepository,
  userRepository,
  webSocketManager,
  requestValidators,
);

// Song Queue Use Cases
export const queueSongUseCase = new QueueSongUseCase(
  songQueueRepository,
  webSocketManager,
  requestValidators,
);

export const removeSongFromQueueUseCase = new RemoveSongFromQueueUseCase(
  songQueueRepository,
  webSocketManager,
  requestValidators,
);

export const editQueuedSongUseCase = new EditQueuedSongUseCase(
  songQueueRepository,
  webSocketManager,
  requestValidators,
);

// User Use Cases
export const createUserUseCase = new CreateUserUseCase(userRepository);
export const updateUsernameUseCase = new UpdateUsernameUseCase(
  userRepository,
  requestValidators,
);
