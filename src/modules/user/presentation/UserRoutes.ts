import { Router } from "express";
import { UserController } from "./UserController.js";
import {
  createUserUseCase,
  updateUsernameUseCase,
} from "../../../shared/core/dependencies.js";

const router = Router();

const userController = new UserController(
  createUserUseCase,
  updateUsernameUseCase,
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new singer
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

/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Update a singer
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - username
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1"
 *               username:
 *                 type: string
 *                 example: "Sang Kang"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.patch("/users", (req, res) => userController.updateUsername(req, res));

export const userRouter = router;
