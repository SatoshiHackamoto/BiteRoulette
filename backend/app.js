import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import userRoutes from './routes/userRoutes.js';
import restaurantRouter from './routes/restaurantRoutes.js';
import typeRouter from './routes/typeRoutes.js';

const backend = express();
backend.use(express.json());

const PORT = 3001;

const mongoDB = "mongodb://127.0.0.1/biteRoulette";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

backend.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

backend.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

backend.use('/users', userRoutes);
backend.use('/restaurants', restaurantRouter);
backend.use('/types', typeRouter);

backend.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});