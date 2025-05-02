import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
    username: String,
    email: String,
    name: String,
    password: String,
    mobile: Number,
    // branch: String,
    // department: String,
    address: String,
    profile: String,
    designation: String
}, { timestamps: true });

const SuperAdmin = new mongoose.model('superadmin', superAdminSchema);

export default SuperAdmin;