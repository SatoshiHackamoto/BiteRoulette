import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    isAdmin: Boolean,
    imagePath: String,
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'restaurant'
    }],
});

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

userSchema.statics.authenticate = async function(username, password) {
    const user = await this.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    return user;
}

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
