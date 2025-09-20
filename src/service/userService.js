const { Sequelize } = require('sequelize');

class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async listUsers() { return this.userRepository.list(); }
  async getUser(id) { return this.userRepository.getById(id); }

  async createUser(payload) {
    if (!payload || !payload.name || !payload.email) {
      const err = new Error('Invalid payload: name and email required'); err.status = 400; throw err;
    }

    try {
      return await this.userRepository.create({ name: payload.name, email: payload.email });
    } catch (err) {
      if (err && (err.name === 'SequelizeUniqueConstraintError' || err instanceof Sequelize.UniqueConstraintError)) {
        const e = new Error('Email already exists');
        e.status = 409;
        throw e;
      }
      throw err;
    }
  }

  async updateUser(id, payload) {
    if (!payload) { const err = new Error('Invalid payload'); err.status = 400; throw err; }
    return this.userRepository.update(id, payload);
  }

  async deleteUser(id) {
    const existed = await this.userRepository.getById(id);
    if (!existed) return false;
    await this.userRepository.delete(id);
    return true;
  }
}

module.exports = UserService;