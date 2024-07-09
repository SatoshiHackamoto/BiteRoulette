import Restaurant from '../models/restaurantModel.js';

const restaurantController = {
    create: async function(req, res) {
        try {
            const coordinates = JSON.parse(req.body.coordinates);
    
            const restaurant = new Restaurant({
                name: req.body.name,
                imagePath: req.file ? "/profile_pictures/" + req.file.filename : null,
                description: req.body.description,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                location: {
                    type: "Point",
                    coordinates: coordinates
                },
                typeOfFood: req.body.typeOfFood 
            });
    
            const savedRestaurant = await restaurant.save();
            return res.status(201).json(savedRestaurant);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating restaurant',
                error: err
            });
        }
    },
    

    update: async function(req, res) {
        try {
            const restaurant = await Restaurant.findById(req.params.id);
            if (!restaurant) {
                return res.status(404).json({
                    message: 'No such restaurant'
                });
            }
    
            restaurant.name = req.body.name || restaurant.name;
            restaurant.imagePath = req.file ? "/profile_pictures/" + req.file.filename : restaurant.imagePath;
            restaurant.description = req.body.description || restaurant.description;
            restaurant.phoneNumber = req.body.phoneNumber || restaurant.phoneNumber;
            restaurant.address = req.body.address || restaurant.address;
            restaurant.typeOfFood = req.body.typeOfFood || restaurant.typeOfFood;
            if (req.body.coordinates) {
                restaurant.location = {
                    type: "Point",
                    coordinates: JSON.parse(req.body.coordinates)
                };
            }
    
            const updatedRestaurant = await restaurant.save();
            return res.json(updatedRestaurant);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating restaurant',
                error: err
            });
        }
    },
    

    list: async function(req, res) {
        try {
            const restaurants = await Restaurant.find();
            return res.json(restaurants);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting restaurants.',
                error: err
            });
        }
    },

    show: async function(req, res) {
        try {
            const restaurant = await Restaurant.findById(req.params.id);
            if (!restaurant) {
                return res.status(404).json({
                    message: 'No such restaurant'
                });
            }
            return res.json(restaurant);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting restaurant.',
                error: err
            });
        }
    },

    getRestaurantsByType: async function(req, res) {
        try {
            const restaurants = await Restaurant.find({ typeOfFood: req.params.type });
            if (restaurants.length === 0) {
                return res.status(404).json({
                    message: 'No restaurants found for this type'
                });
            }
            return res.json(restaurants);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting restaurants by type',
                error: err
            });
        }
    },

    getRestaurantsWithinRadius: async function(req, res) {
        try {
            const { latitude, longitude } = req.query;
            const radius = 1000 / 6378.1;

            const restaurants = await Restaurant.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude], radius
                        ]
                    }
                }
            });

            if (restaurants.length === 0) {
                return res.status(404).json({
                    message: 'No restaurants found within 500 meters'
                });
            }

            return res.json(restaurants);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting restaurants within radius',
                error: err
            });
        }
    },

    getRestaurantsWithinRadiusByType: async function(req, res) {
        try {
            const { latitude, longitude, type } = req.query;
            const radius = 500 / 6378.1; // Radius in radians (500 meters)

            const restaurants = await Restaurant.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude], radius
                        ]
                    }
                },
                typeOfFood: type
            });

            if (restaurants.length === 0) {
                return res.status(404).json({
                    message: 'No restaurants found within 500 meters for the specified type'
                });
            }

            return res.json(restaurants);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting restaurants within radius by type',
                error: err
            });
        }
    },
    delete: async function(req, res) {
        try {
            const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
            if (!restaurant) {
                return res.status(404).json({
                    message: 'No such restaurant'
                });
            }
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting restaurant',
                error: err
            });
        }
    },

    getRandomResaurantWithConditions: async function(req, res) {
        try {
            const { distance, typeOfFood } = req.params;
            const { latitude, longitude } = req.query; 

            if (!latitude || !longitude) {
                return res.status(400).json({
                    message: 'Latitude and longitude are required'
                });
            }

            const radius = distance / 6378.1;

            let restaurants = await Restaurant.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [longitude, latitude], radius
                        ]
                    }
                },
                typeOfFood: typeOfFood
            });

            if (restaurants.length === 0) {
                restaurants = await Restaurant.find();
            }

            if (restaurants.length === 0) {
                return res.status(404).json({
                    message: 'No restaurants found'
                });
            }

            const randomIndex = Math.floor(Math.random() * restaurants.length);
            const randomRestaurant = restaurants[randomIndex];

            return res.json(randomRestaurant);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting a random restaurant with conditions',
                error: err
            });
        }
    },
    getRestaurantsByType: async function(req, res) {
        try {
            const type = req.params.type;
            const restaurants = await Restaurant.find({ typeOfFood: type });
            
            if (restaurants.length === 0) {
                return res.status(404).json({
                    message: 'No restaurants found for this type'
                });
            }
            
            return res.json(restaurants);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting restaurants by type',
                error: err
            });
        }
    }
    
    
};

export default restaurantController;
