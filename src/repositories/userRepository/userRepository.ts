import { ModelStatic } from 'sequelize';
import { User } from '@/models/user';

export default class UserRepository {
  private UserModel: ModelStatic<User>;

  constructor({ userModel }: { userModel: ModelStatic<User> }) {
    this.UserModel = userModel;
  }

  async list() {
    const rows = await this.UserModel.findAll({ order: [['createdAt', 'ASC']] });
    return rows.map(r => r.get({ plain: true }) as unknown as User);
  }

  async getById(id: string) {
    const row = await this.UserModel.findByPk(id);
    return row ? (row.get({ plain: true }) as unknown as User) : null;
  }

  async create(payload: { name: string; email: string; }) {
    const created = await this.UserModel.create(payload as any);
    return created.get({ plain: true }) as unknown as User;
  }

  async update(id: string, patch: Partial<User>) {
    const row = await this.UserModel.findByPk(id);
    if (!row) return null;
    await row.update(patch);
    return row.get({ plain: true }) as unknown as User;
  }

  async delete(id: string) {
    const deleted = await this.UserModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
