import mongoose from 'mongoose'

const reqSchema = new mongoose.Schema({
    username: String,
    email: String,
    name: String,
    mobile: Number,
    branch: String,
    department: String,
    address: String,
    profile: String,
    designation: String
});

const UserRequests = new mongoose.model('user-requests', reqSchema);

export default UserRequests;