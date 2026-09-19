export interface CreateRoomReq {
  roomName: string;
  hostId: number;
}

export interface DeleteRoomReq {
  roomId: number;
  hostId: number;
}

export interface JoinRoomReq {
  userId: string;
  roomId: number;
  roomCode: string;
}

export interface LeaveRoomReq {
  userId: string;
  roomId: number;
}
