export class SongEntry {
  constructor(
    private readonly id: string,
    private readonly roomId: number,
    private readonly userId: number,
    private songName: string,
    private mediaUrl: string,
    private hasPlayed: boolean,
  ) {}

  public getSongEntryInfo() {
    return {
      songEntryId: this.id,
      roomId: this.roomId,
      userId: this.userId,
      songName: this.songName,
      mediaUrl: this.mediaUrl,
      hasPlayed: this.hasPlayed,
    };
  }

  public changeSong(songName: string, mediaUrl: string) {
    this.songName = songName;
    this.mediaUrl = mediaUrl;
  }

  public markAsPlayed() {
    if (this.hasPlayed) {
      throw new Error(
        "Cannot mark song as played: this song has already finished.",
      );
    }
    this.hasPlayed = true;
  }
}
