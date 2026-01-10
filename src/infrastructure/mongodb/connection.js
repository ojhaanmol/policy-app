const mongoose = require('mongoose');

async function connectDb() {
    const uri = process.env.MONGO_URI;

    if (!uri) 
        throw new Error('MONGO_URI is not defined');
    

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
    });

    await mongoose.connect(uri, {
        autoIndex: true,
    });
}

module.exports= { connectDb }