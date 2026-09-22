import { Router } from "express";
import { UserController } from "./UserController.js";
import { createUserUseCase } from "../../../shared/core/dependencies.js";

const router = Router();

const userController = new UserController(createUserUseCase);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new karaoke singer
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: "The Throat Goat"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/users", (req, res) => userController.createUser(req, res));

export const userRouter = router;
