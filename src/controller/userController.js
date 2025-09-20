class UserController {
  constructor({ userService }) {
    this.userService = userService;
  }

  async listUsers(req, res, next) {
    try {
      const users = await this.userService.listUsers();
      res.json(users);
    } catch (e) { next(e); }
  }

  async getUser(req, res, next) {
    try {
      const user = await this.userService.getUser(req.params.id);
      if (!user) return res.status(404).json({ error: 'Not found' });
      res.json(user);
    } catch (e) { next(e); }
  }

  async createUser(req, res, next) {
    try {
      const created = await this.userService.createUser(req.body);
      res.status(201).json(created);
    } catch (e) { next(e); }
  }

  async updateUser(req, res, next) {
    try {
      const updated = await this.userService.updateUser(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (e) { next(e); }
  }

  async deleteUser(req, res, next) {
    try {
      const ok = await this.userService.deleteUser(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      res.status(204).send();
    } catch (e) { next(e); }
  }
}

module.exports = UserController;