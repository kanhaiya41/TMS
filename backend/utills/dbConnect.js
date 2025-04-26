import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(() => console.log('successfully connected to db'));
    } catch (error) {
        console.log('while connecting to db', error);
    }
}

export default dbConnect;