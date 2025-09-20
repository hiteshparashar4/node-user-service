import { ModelStatic } from "sequelize";
import { User, UserAttributes } from "@/models/user";
import { CreateUserPayload } from "@/types/defaults";

export default class UserRepository {
  private UserModel: ModelStatic<User>;

  constructor({ userModel }: { userModel: ModelStatic<User> }) {
    this.UserModel = userModel;
  }

  async list(): Promise<UserAttributes[]> {
    const rows = await this.UserModel.findAll({
      order: [["createdAt", "ASC"]],
    });
    return rows.map((r) => r.toJSON() as UserAttributes);
  }

  async getById(id: string): Promise<UserAttributes | null> {
    const row = await this.UserModel.findByPk(id);
    return row ? (row.toJSON() as UserAttributes) : null;
  }

  async create(payload: CreateUserPayload): Promise<UserAttributes> {
    const created = await this.UserModel.create(payload as any);
    return created.toJSON() as UserAttributes;
  }

  async update(
    id: string,
    patch: Partial<UserAttributes>
  ): Promise<UserAttributes | null> {
    const row = await this.UserModel.findByPk(id);
    if (!row) return null;
    await row.update(patch);
    return row.toJSON() as UserAttributes;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.UserModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
