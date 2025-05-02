import mongoose from "mongoose";


const departmentSchema = new mongoose.Schema({
    name: String,
    description: String,
    teamleader: String,
    executives: String,
    tickets: String,
    branch: String
}, {
    timestamps: true
});

const Department = new mongoose.model('department', departmentSchema);

export default Department;