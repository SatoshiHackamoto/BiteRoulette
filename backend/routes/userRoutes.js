import express from 'express';
import userController from '../controllers/userController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'public/profile_pictures/' });

router.get('/', userController.list);
router.get('/profile', userController.profile);
router.post('/logout', userController.logout);
router.get('/:id', userController.show);

router.post('/', upload.single('image'), userController.create);
router.post('/login', userController.login);

router.put('/:id', userController.update);

router.delete('/:id', userController.remove);

export default router;