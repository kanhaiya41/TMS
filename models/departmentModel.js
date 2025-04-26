import mongoose from "mongoose";


const departmentSchema = new mongoose.Schema({
    name: String,
    description: String,
    manager: String,
    teamleader: String,
    branch: String
});

const Department = new mongoose.model('department', departmentSchema);

export default Department;