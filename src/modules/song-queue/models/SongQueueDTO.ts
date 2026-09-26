export interface QueueSongReq {
  userId: string;
  roomId: string;
  songName: string;
  mediaUrl: string;
}

export interface RemoveSongFromQueueReq {
  userId: string;
  roomId: string;
  songId: string;
}
