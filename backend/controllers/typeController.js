import Type from '../models/typeModel.js';

const typeController = {
    create: async function(req, res) {
        try {
            const type = new Type({
                name: req.body.name
            });

            const savedType = await type.save();
            return res.status(201).json(savedType);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating type',
                error: err
            });
        }
    },

    update: async function(req, res) {
        try {
            const type = await Type.findById(req.params.id);
            if (!type) {
                return res.status(404).json({
                    message: 'No such type'
                });
            }

            type.name = req.body.name || type.name;

            const updatedType = await type.save();
            return res.json(updatedType);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating type',
                error: err
            });
        }
    },

    list: async function(req, res) {
        try {
            const types = await Type.find();
            return res.json(types);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting types.',
                error: err
            });
        }
    },

    show: async function(req, res) {
        try {
            const type = await Type.findById(req.params.id);
            if (!type) {
                return res.status(404).json({
                    message: 'No such type'
                });
            }
            return res.json(type);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting type.',
                error: err
            });
        }
    },

    delete: async function(req, res) {
        try {
            const type = await Type.findById(req.params.id);
            if (!type) {
                return res.status(404).json({
                    message: 'No such type'
                });
            }
    
            await type.remove();
            return res.status(204).send();
        } catch (err) {
            console.error('Error when deleting type:', err); // Log the error for debugging
            return res.status(500).json({
                message: 'Error when deleting type',
                error: err
            });
        }
    }
    
};

export default typeController;