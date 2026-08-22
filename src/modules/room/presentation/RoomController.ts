// import type { RenameRoomUseCase } from "../application/RenameRoomUseCase.js";

// import type { Request, Response } from "express";

// interface RoomParams {
//   id: string;
// }

// // Define the shape of your request body
// interface RenameRoomBody {
//   newName: string;
// }

// export class RoomController {
//   constructor(private renameRoomUseCase: RenameRoomUseCase) {}

//   public renameRoom = async (
//     req: Request<RoomParams, any, RenameRoomBody>,
//     res: Response,
//   ): Promise<void> => {
//     try {
//       const roomId = req.params.id;
//       const { newName } = req.body;

//       const updatedRoom = await this.renameRoomUseCase.execute({
//         roomId,
//         newName,
//       });

//       res.status(200).json({
//         message: `Room renamed successfully to : ${newName}`,
//         room: updatedRoom,
//       });
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   };
// }
