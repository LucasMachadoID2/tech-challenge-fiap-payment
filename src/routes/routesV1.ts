import { Router } from "express";
import * as UsersController from "../controllers/users-controller";

const router = Router();

router.get("/users", UsersController.getUsers);

router.get("/users/:email", UsersController.getUserByEmail);

router.post("/users", UsersController.postUser);

router.delete("/users/:email", UsersController.deleteUser);

router.patch("/users/:email", UsersController.updateUser); // verifica, não fucionou

export default router;
