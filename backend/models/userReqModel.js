import mongoose from "mongoose";

const userReqSchema = new mongoose.Schema({
    username: String,
    email: String,
    mobile: Number,
    branch: String,
    department: String,
    address: String,
    profile: String,
    designation: String,
    reqto: String,
    status: String
});

const UserEditRequests = new mongoose.model('userRequest', userReqSchema);

export default UserEditRequests;