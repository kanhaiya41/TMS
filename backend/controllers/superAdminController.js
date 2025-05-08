import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import UserRequests from '../models/reqModel.js';
import Branch from '../models/branchModel.js';
import Admin from '../models/adminModel.js';
import Notification from '../models/notificationModel.js';

export const makeAdmin = async (req, res) => {
    try {
        let { username, email, name, password, mobile, branches, address, designation } = req.body;

        if (!Array.isArray(branches)) {
            branches = [branches]; // agar ek hi branch aaye to bhi array bana lo
        }

        if (!username || !email || !name || !password || !mobile || !address) {
            return res.status(401).json({
                success: false,
                message: 'Something is missing,Please cheack!'
            });
        }

        let imageUrl;
        if (req.file) {
            imageUrl = `https://tms-2bk0.onrender.com/file/${req.file.originalname}`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const existUsername = await Admin.findOne({ username });
        const existEmail = await Admin.findOne({ email });
        const existMobile = await Admin.findOne({ mobile });
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

        if (branches.length > 0) {
            const updateResult = await Branch.updateMany(
                { name: { $in: branches } },
                { $set: { admin: username } }
            );

        }

        const user = await Admin({ username, email, name, password: hashedPassword, mobile, branches, address, profile: imageUrl, designation });
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

export const getAllAdmins = async (req, res) => {
    try {
        const allBranchesData = await Admin.find().select('-password');
        res.status(200).json({
            success: true,
            allBranchesData
        });
    } catch (error) {
        console.log('While get all admins', error);
    }
}

export const getRequests = async (req, res) => {
    try {
        const allRequests = await UserRequests.find();
        res.status(200).json({
            success: true,
            allRequests
        })
    } catch (error) {
        console.log("while geting user requests", error);
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });
        const dltReq = await UserRequests.findOneAndDelete({ email });
        if (user) {
            return res.status(200).json({
                success: true,
                message: 'Password Successfully Updated!😊'
            });
        }
    } catch (error) {
        console.log('while update password', error);
    }
}

export const createBranch = async (req, res) => {
    try {
        const branch = await Branch(req.body);
        const saveBranch = await branch.save();
        if (saveBranch) {
            return res.status(200).json({
                success: true,
                message: 'Branch Created Successfully!😊'
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Error Occure'
            })
        }
    } catch (error) {
        console.log("while creating branch", error);
    }
}

export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        if (branches) {
            return res.status(200).json({
                success: true,
                branches
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'No Branches Available!'
            })
        }
    } catch (error) {
        console.log(('while geting branches for super admin', error));
    }
}

export const updateBranch = async (req, res) => {
    console.log('branchid', req.body.branchid);
    try {

        const branchId = req.body.branchid;
        const branch = await Branch.findById(branchId);
        let branchUpdated = false;

        if (req.body?.name && branch?.name !== req?.body?.name) {
            const name = await Branch.findByIdAndUpdate(branchId, { name: req.body.name });
            branchUpdated = true;
        }
        if (req.body?.location && branch?.location !== req?.body?.location) {
            const username = await Branch.findByIdAndUpdate(branchId, { location: req.body.location });
            branchUpdated = true;
        }
        if (req.body?.admin && branch?.admin !== req?.body?.admin) {

            const adminBranch = await Branch.findByIdAndUpdate(
                branchId,
                { admin: req.body.admin },
                { new: true } // So you get the updated document
            );


            if (!adminBranch) {
                return res.status(404).json({ message: "Branch not found" });
            }

            const prevAdmin = await Admin.findOneAndUpdate(
                { branches: adminBranch.name },
                { $pull: { branches: adminBranch.name } }
            );

            const updateAdmin = await Admin.findOneAndUpdate(
                { username: req.body.admin },
                { $addToSet: { branches: adminBranch.name } } // Use $addToSet to avoid duplicates
            );

            const updateNotify = await Notification.findOneAndUpdate({ user: prevAdmin._id }, { $pull: { branches: adminBranch.name } });
            const updatenewNotify = await Notification.findOneAndUpdate({ user: updateAdminAdmin._id }, { $push: { branches: adminBranch.name } });

            branchUpdated = true;
        }

        if (branchUpdated) {
            return res?.status(200).json({
                success: true,
                message: 'Branch Successfully Updated 👍'
            })
        }
        else {
            return res?.status(400).json({
                success: false,
                message: 'No Changes in Branch!'
            })
        }

    } catch (error) {
        console.log("while updating branch", error);
    }
}

export const deleteBranch = async (req, res) => {
    try {
        const id = req.params.id;
        const branch = await Branch.findByIdAndDelete(id);
        if (branch) {
            return res.status(200).json({
                success: true,
                message: 'Branch Deleted!'
            });
        }
    } catch (error) {
        console.log("while deleting branch", error);
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const request = await Admin.findByIdAndDelete(id);
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