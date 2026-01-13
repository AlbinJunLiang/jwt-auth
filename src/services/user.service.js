import db from '../models/index.js';
const { User } = db;

export default {
    getAllUsers: async () => await User.findAll(),

    getUserById: async (id) => await User.findByPk(id),

    createUser: async (data) => await User.create(data),

    updateUser: async (id, data) => {
        const user = await User.findByPk(id);
        if (!user) return null;
        return await user.update(data);
    },

    deleteUser: async (id) => {
        const user = await User.findByPk(id);
        if (!user) return false;
        await user.destroy();
        return true;
    },
};
