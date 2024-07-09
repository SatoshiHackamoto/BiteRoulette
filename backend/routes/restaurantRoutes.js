import express from 'express';
import multer from 'multer';
import restaurantController from '../controllers/restaurantController.js';


const restaurantRouter = express.Router();
const upload = multer({ dest: 'public/profile_pictures/' });

restaurantRouter.post('/', upload.single('image'), restaurantController.create);
restaurantRouter.put('/:id', upload.single('image'), restaurantController.update);
restaurantRouter.get('/', restaurantController.list);
restaurantRouter.get('/:id', restaurantController.show);
restaurantRouter.get('/type/:type', restaurantController.getRestaurantsByType);
restaurantRouter.get('/nearby/allRestaurants', restaurantController.getRestaurantsWithinRadius);
restaurantRouter.get('/nearby/type', restaurantController.getRestaurantsWithinRadiusByType);
restaurantRouter.get('/roulette/:distance/:typeOfFood', restaurantController.getRandomResaurantWithConditions);
restaurantRouter.delete('/:id', restaurantController.delete);


export default restaurantRouter;