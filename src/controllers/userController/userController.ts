import { Request, Response, NextFunction } from "express";
import UserService from "@/services/userService/userService";
import { CreateUserPayload } from "@/types/defaults";

export default class UserController {
  private userService: UserService;

  constructor({ userService }: { userService: UserService }) {
    this.userService = userService;
  }

  listUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.listUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUser(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });
      res.json(user);
    } catch (e) {
      next(e);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: CreateUserPayload = req.body;
      const created = await this.userService.createUser(payload);
      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.userService.updateUser(
        req.params.id,
        req.body
      );
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ok = await this.userService.deleteUser(req.params.id);
      if (!ok) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}
