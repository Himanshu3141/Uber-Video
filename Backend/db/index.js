const mongoose = require("mongoose");
require("dotenv").config();


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log(`Database connected successfully!! DB HOST:${connectionInstance.connection.host}`);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
