import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import UserRequests from '../models/reqModel.js';
import Branch from '../models/branchModel.js';

export const makeAdmin = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json('Profile pic not found');
        }
        const { username, email, name, password, mobile, branch, address, designation } = req.body;
        if (!username || !email || !name || !password || !mobile || !branch || !address) {
            return res.status(401).json({
                success: false,
                message: 'Something is missing,Please cheack!'
            });
        }

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
        const user = await User({ username, email, name, password: hashedPassword, mobile, branch, address, profile: imageUrl, designation });
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

export const getAllBranches = async (req, res) => {
    try {
        const allBranchesData = await User.find().select('-password');
        res.status(200).json({
            success: true,
            allBranchesData
        });
    } catch (error) {
        console.log('While get all branches', error);
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
    console.log('branchid',req.body.branchid);
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
            const admin = await Branch.findByIdAndUpdate(branchId, { admin: req.body.admin });
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
