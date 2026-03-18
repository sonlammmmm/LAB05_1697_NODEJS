const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { username } = req.query;
        let query = { isDeleted: false };
        if (username) {
            query.username = { $regex: username, $options: 'i' };
        }
        const users = await User.find(query).populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.softDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: "User soft deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found or information incorrect" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found or information incorrect" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUsersByRole = async (req, res) => {
    try {
        const users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
