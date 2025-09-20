import UserRepository from "@/repositories/userRepository/userRepository";

export default class UserService {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async listUsers() {
    return this.userRepository.list();
  }
  async getUser(id: string) {
    return this.userRepository.getById(id);
  }

  async createUser(payload: { name: string; email: string }) {
    if (!payload || !payload.name || !payload.email) {
      const err: any = new Error("Invalid payload: name and email required");
      err.status = 400;
      throw err;
    }

    try {
      return await this.userRepository.create({
        name: payload.name,
        email: payload.email,
      });
    } catch (err: any) {
      if (
        err &&
        (err.name === "SequelizeUniqueConstraintError" ||
          err instanceof require("sequelize").UniqueConstraintError)
      ) {
        const e: any = new Error("Email already exists");
        e.status = 409;
        throw e;
      }
      throw err;
    }
  }

  async updateUser(id: string, payload: any) {
    if (!payload) {
      const err: any = new Error("Invalid payload");
      err.status = 400;
      throw err;
    }
    return this.userRepository.update(id, payload);
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}
