import { UniqueConstraintError } from "sequelize";
import { CreateUserPayload } from "@/types/defaults";
import UserRepository from "@/repositories/userRepository/userRepository";
import { UserAttributes } from "@/models/user";
export default class UserService {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async listUsers(): Promise<UserAttributes[]> {
    return this.userRepository.list();
  }

  async getUser(id: string): Promise<UserAttributes | null> {
    return this.userRepository.getById(id);
  }

  async createUser(payload: CreateUserPayload): Promise<UserAttributes> {
    if (!payload?.name || !payload?.email) {
      const err: any = new Error("Invalid payload: name and email required");
      err.status = 400;
      throw err;
    }

    try {
      return await this.userRepository.create(payload);
    } catch (err: any) {
      // Sequelize unique constraint error handling
      if (
        err instanceof UniqueConstraintError ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        const e: any = new Error("Email already exists");
        e.status = 409;
        throw e;
      }
      throw err;
    }
  }

  async updateUser(
    id: string,
    payload: Partial<CreateUserPayload>
  ): Promise<UserAttributes | null> {
    if (!payload) {
      const err: any = new Error("Invalid payload");
      err.status = 400;
      throw err;
    }
    return this.userRepository.update(id, payload);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
