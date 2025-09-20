class UserRepository {
  constructor({ userModel }) {
    this.User = userModel;
  }

  async list() {
    const rows = await this.User.findAll({ order: [['createdAt', 'ASC']] });
    return rows.map(r => r.toJSON());
  }

  async getById(id) {
    const row = await this.User.findByPk(id);
    return row ? row.toJSON() : null;
  }

  async create(user) {
    const created = await this.User.create(user);
    return created.toJSON();
  }

  async update(id, patch) {
    const row = await this.User.findByPk(id);
    if (!row) return null;
    await row.update(patch);
    return row.toJSON();
  }

  async delete(id) {
    const deleted = await this.User.destroy({ where: { id } });
    return deleted > 0;
  }
}

module.exports = UserRepository;