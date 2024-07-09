import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';

const userController = {
    list: async function(req, res) {
        try {
            const users = await UserModel.find();
            return res.json(users);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting user.',
                error: err
            });
        }
    },

    show: async function(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.json(user);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting user.',
                error: err
            });
        }
    },

    create: async function(req, res) {
        try {
            const user = new UserModel({
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                imagePath: req.file ? "/profile_pictures/" + req.file.filename : null,
                email: req.body.email,
                isAdmin: req.body.isAdmin || false,
                favorites: req.body.favorites || []
            });

            const savedUser = await user.save();
            console.log("User created with status 201");
            return res.status(201).json(savedUser);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating user',
                error: err
            });
        }
    },

    update: async function(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }

            Object.assign(user, req.body);

            const updatedUser = await user.save();
            return res.json(updatedUser);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating user.',
                error: err
            });
        }
    },

    remove: async function(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            await UserModel.findByIdAndRemove(req.params.id);
            return res.status(204).json({
                message: 'User deleted successfully'
            });
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the user.',
                error: err
            });
        }
    },

    showRegister: function(req, res) {
        res.render('user/register');
    },

    showLogin: function(req, res) {
        res.render('user/login');
    },

    login: async function(req, res, next) {
        try {
            const user = await UserModel.authenticate(req.body.username, req.body.password);
            if (!user) {
                return res.status(401).json({ message: 'Wrong username or password' });
            }
            req.session.userId = user._id;
            return res.json(user);
        } catch (err) {
            return res.status(401).json({ message: err.message });
        }
    },

    profile: async function(req, res, next) {
        try {
            const user = await UserModel.findById(req.session.userId);
            if (!user) {
                const err = new Error('Not authorized, go back!');
                err.status = 400;
                return next(err);
            }
            return res.json(user);
        } catch (err) {
            return next(err);
        }
    },

    logout: function(req, res, next) {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    return next(err);
                } else {
                    return res.status(201).json({});
                }
            });
        }
    }
};

export default userController;