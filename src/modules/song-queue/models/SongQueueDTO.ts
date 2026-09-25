export interface QueueSongReq {
  userId: string;
  roomId: number;
  songName: string;
  mediaUrl: string;
}

export interface RemoveSongFromQueueReq {
  userId: string;
  roomId: number;
  songId: string;
}
