import mongoose from 'mongoose';

const { Schema } = mongoose;

const typeSchema = new Schema({
    name: String,
});

const Type = mongoose.model('type', typeSchema);
export default Type;