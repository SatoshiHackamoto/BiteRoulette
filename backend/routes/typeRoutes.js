import express from 'express';
import multer from 'multer';
import typeController from '../controllers/typeController.js';

const typeRouter = express.Router();

typeRouter.post('/', typeController.create);
typeRouter.put('/:id', typeController.update);
typeRouter.get('/', typeController.list);
typeRouter.get('/:id', typeController.show);
typeRouter.delete('/:id', typeController.delete);

export default typeRouter;