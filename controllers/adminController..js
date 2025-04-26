import Branch from "../models/branchModel.js";
import Department from "../models/departmentModel.js";
import UserRequests from "../models/reqModel.js";
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'

export const addUser = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json('Profile pic not found');
        }
        const { username, email, password, mobile, branch, address, department, designation } = req.body;

        const imageUrl = `${process.env.URI}/file/${req.file.originalname}`;

        const hashedPassword = await bcrypt.hash(password, 10);
        const existUsername = await User.findOne({ username });
        const existEmail = await User.findOne({ email });
        const existMobile = await User.findOne({ mobile });
        if (existUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already exist!'
            });
        }
        if (existEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already exist!'
            });
        }
        if (existMobile) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate Mobile number!'
            });
        }
        const user = await User({ ...req.body, profile: imageUrl, password: hashedPassword });
        const us = await user.save();
        res.status(200).json({
            success: true,
            message: 'User created Successfully🤗',
            // us
        })
    } catch (error) {
        console.log('while make admin', error);
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.body.userid;
        const user = await User.findById(userId);
        let userUpdated = false;

        if (req.body?.username && user?.username !== req?.body?.username) {
            const username = await User.findByIdAndUpdate(userId, { username: req.body.username });
            userUpdated = true;
        }
        if (req.body?.email && user?.email !== req?.body?.email) {
            const username = await User.findByIdAndUpdate(userId, { email: req.body.email });
            userUpdated = true;
        }
        if (req.body?.name && user?.name !== req?.body?.name) {
            const name = await User.findByIdAndUpdate(userId, { name: req.body.name });
            userUpdated = true;
        }
        if (req.body?.password && user?.password !== req?.body?.password) {
            const hashedPassword = await bcrypt.hash(req?.body?.password, 10);
            const password = await User.findByIdAndUpdate(userId, { password: hashedPassword });
            userUpdated = true;
        }
        if (req.body?.mobile && String(user?.mobile) !== String(req?.body?.mobile)) {
            const mobile = await User.findByIdAndUpdate(userId, { mobile: req.body.mobile });
            userUpdated = true;
        }
        if (req.body?.branch && user?.branch !== req?.body?.branch) {
            const branch = await User.findByIdAndUpdate(userId, { branch: req.body.branch });
            userUpdated = true;
        }
        if (req.body?.department && user?.department !== req?.body?.department) {
            const department = await User.findByIdAndUpdate(userId, { department: req.body.department });
            userUpdated = true;
        }
        if (req.body?.address && user?.address !== req?.body?.address) {
            const address = await User.findByIdAndUpdate(userId, { address: req.body.address });
            userUpdated = true;
        }
        if (req.body?.designation && user?.designation !== req?.body?.designation) {
            const designation = await User.findByIdAndUpdate(userId, { designation: req.body.designation });
            userUpdated = true;
        }
        if (req?.file) {
            const imageUrl = `${process.env.URI}/file/${req.file.originalname}`;
            const profile = await User.findByIdAndUpdate(userId, { profile: imageUrl });
            userUpdated = true;
        }

        if (userUpdated) {
            return res?.status(200).json({
                success: true,
                message: 'User Successfully Updated 👍'
            })
        }
        else {
            return res?.status(400).json({
                success: false,
                message: 'No Changes in User!'
            })
        }

    } catch (error) {
        console.log("while updating user", error);
    }
}

export const deleteUpdateRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const request = await UserRequests.findByIdAndDelete(id);
        if (request) {
            return res.status(200).json({
                success: true,
                message: 'Request Deleted!'
            });
        }
    } catch (error) {
        console.log("while delete update request", error);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const request = await User.findByIdAndDelete(id);
        if (request) {
            return res.status(200).json({
                success: true,
                message: 'User Deleted!'
            });
        }
    } catch (error) {
        console.log("while deleting user", error);
    }
}

export const createDepartment = async (req, res) => {
    try {
        const department = await Department(req.body);
        const saveDepartment = await department.save();
        const departmentLength = await Department.countDocuments();
        const updateBranch = await Branch.findOneAndUpdate({ name: req.body.branch }, { departments: departmentLength })
        if (saveDepartment) {
            return res.status(200).json({
                success: true,
                message: 'Department Created Successfully!😊'
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Error Occure'
            })
        }
    } catch (error) {
        console.log("while creating department", error);
    }
}

export const getDepartments = async (req, res) => {
    try {
        const departmentes = await Department.find();
        if (departmentes) {
            return res.status(200).json({
                success: true,
                departmentes
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'No Departmentes Available!'
            })
        }
    } catch (error) {
        console.log(('while geting departmentes for super admin', error));
    }
}

export const deleteDepartment = async (req, res) => {
    try {
        const id = req.params.id;
        const request = await Department.findByIdAndDelete(id);
        const departmentLength = await Department.countDocuments();
        const updateBranch = await Branch.findOneAndUpdate({ name: req.body.branch }, { departments: departmentLength })
        if (request) {
            return res.status(200).json({
                success: true,
                message: 'Department Deleted!'
            });
        }
    } catch (error) {
        console.log("while deleting department", error);
    }
}

export const updateDepartment = async (req, res) => {
    try {
        const departmentId = req.body.departmentid;
        const user = await Department.findById(departmentId);
        let userUpdated = false;

        if (req.body?.name && user?.name !== req?.body?.name) {
            const name = await Department.findByIdAndUpdate(departmentId, { name: req.body.name });
            userUpdated = true;
        }
        if (req.body?.description && user?.description !== req?.body?.description) {
            const username = await Department.findByIdAndUpdate(departmentId, { description: req.body.description });
            userUpdated = true;
        }
        if (req.body?.manager && user?.manager !== req?.body?.manager) {
            const manager = await Department.findByIdAndUpdate(departmentId, { manager: req.body.manager });
            userUpdated = true;
        }
        if (req.body?.branch && user?.branch !== req?.body?.branch) {
            const branch = await Department.findByIdAndUpdate(departmentId, { branch: req.body.branch });
            userUpdated = true;
        }
        if (req.body?.teamleader && user?.teamleader !== req?.body?.teamleader) {
            const teamleader = await Department.findByIdAndUpdate(departmentId, { teamleader: req.body.teamleader });
            userUpdated = true;
        }

        if (userUpdated) {
            return res?.status(200).json({
                success: true,
                message: 'Department Successfully Updated 👍'
            })
        }
        else {
            return res?.status(400).json({
                success: false,
                message: 'No Changes in Department!'
            })
        }

    } catch (error) {
        console.log("while updating user", error);
    }
}