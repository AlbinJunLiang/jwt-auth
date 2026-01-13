import UserService from '../services/user.service.js';

export default {
    getAll: async (req, res) => {
        const users = await UserService.getAllUsers();
        res.json(users);
    },

    getById: async (req, res) => {
        const id = parseInt(req.params.id);
        const user = await UserService.getUserById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    },

    create: async (req, res) => {
        const user = await UserService.createUser(req.body);
        res.status(201).json(user);
    },

    update: async (req, res) => {
        const id = parseInt(req.params.id);
        const user = await UserService.updateUser(id, req.body);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    },

    delete: async (req, res) => {
        const id = parseInt(req.params.id);
        const deleted = await UserService.deleteUser(id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    },
};
