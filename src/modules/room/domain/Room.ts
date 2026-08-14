export class Room {
    constructor(
        public readonly id:string,
        public name:string
    ){}

    public rename(newName: string){
        if(!newName || newName.trim().length < 3)
       { throw new Error(`Room name ${newName} is invalid, Room name must be at least 3 characters long`)}
        this.name = newName.trim()
    }
}