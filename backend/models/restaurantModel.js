import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const restaurantSchema = new Schema({
    name: String,
    imagePath: String,
    description: String,
    phoneNumber: String,
    address: String,
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Types.Decimal128],
            required: true,
            validate: {
                validator: function(coords) {
                    return coords.length === 2;
                },
                message: 'Coordinates must be an array of two numbers'
            },
            set: function(coords) {
                return coords.map(coord => Types.Decimal128.fromString(coord.toString()));
            }
        },
    },
    typeOfFood: [{
        type: Schema.Types.ObjectId,
        ref: 'type'
    }],
});

const Restaurant = mongoose.model('restaurant', restaurantSchema);
export default Restaurant;