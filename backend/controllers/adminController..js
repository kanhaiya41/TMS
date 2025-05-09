import Admin from "../models/adminModel.js";
import Branch from "../models/branchModel.js";
import Department from "../models/departmentModel.js";
import Manager from "../models/managerModel.js";
import Notification from "../models/notificationModel.js";
import UserRequests from "../models/reqModel.js";
import TeamLeader from "../models/teamLeaderModel.js";
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'

export const addUser = async (req, res) => {
    try {

        // const { username, email, password, mobile, branch, address, department, designation } = req.body;

        if (!req.body.username || !req.body.email || !req.body.name || !req.body.password || !req.body.mobile || !req.body.address) {
            return res.status(401).json({
                success: false,
                message: 'Something is missing,Please cheack!'
            });
        }

        let imageUrl;
        if (req.file) {
            imageUrl = `https://tms-2bk0.onrender.com/file/${req.file.originalname}`;
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let existEmail, existMobile, existUsername;
        if (req.body.designation === 'Executive') {
            existUsername = await User.findOne({ username: req.body.usesrname });
            existEmail = await User.findOne({ email: req.body.email });
            existMobile = await User.findOne({ mobile: req.body.mobile });
        }
        if (req.body.designation === 'Manager') {
            existUsername = await Manager.findOne({ username: req.body.usesrname });
            existEmail = await Manager.findOne({ email: req.body.email });
            existMobile = await Manager.findOne({ mobile: req.body.mobile });
        }
        if (req.body.designation === 'Team Leader') {
            existUsername = await TeamLeader.findOne({ username: req.body.usesrname });
            existEmail = await TeamLeader.findOne({ email: req.body.email });
            existMobile = await TeamLeader.findOne({ mobile: req.body.mobile });
        }

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
        let user;
        if (req.body.designation === 'Executive') {
            user = await User({ ...req.body, profile: imageUrl, password: hashedPassword });
        }
        if (req.body.designation === 'Manager') {
            user = await Manager({ ...req.body, profile: imageUrl, password: hashedPassword });
        }
        if (req.body.designation === 'Team Leader') {
            // console.log(req.body.department);
            user = await TeamLeader({ ...req.body, profile: imageUrl, password: hashedPassword });
            if (req.body.department) {
                await Department.updateOne({ name: req.body.department }, { teamleader: req.body.username });
            }
        }
        const us = await user.save();
        return res.status(200).json({
            success: true,
            message: 'User created Successfully🤗',
            // us
        })
    } catch (error) {
        console.log('while make User', error);
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.body.userid;
        let user;
        let userUpdated = false;

        if (req.body.designation === 'Executive') {
            user = await User.findById(userId);
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
                const notifyBranch = await Notification.findOneAndUpdate({ user: userId }, { branch: req.body.branch });
                userUpdated = true;
            }
            if (req.body?.department && user?.department !== req?.body?.department) {
                const department = await User.findByIdAndUpdate(userId, { department: req.body.department });
                const notifyDepartment = await Notification.findOneAndUpdate({ user: userId }, { dept: req.body.department });
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
                const imageUrl = `https://tms-2bk0.onrender.com/file/${req.file.originalname}`;
                const profile = await User.findByIdAndUpdate(userId, { profile: imageUrl });
                userUpdated = true;
            }
        }

        if (req.body.designation === 'Manager') {
            user = await Manager.findById(userId);
            if (req.body?.username && user?.username !== req?.body?.username) {
                const username = await Manager.findByIdAndUpdate(userId, { username: req.body.username });
                userUpdated = true;
            }
            if (req.body?.email && user?.email !== req?.body?.email) {
                const username = await Manager.findByIdAndUpdate(userId, { email: req.body.email });
                userUpdated = true;
            }
            if (req.body?.name && user?.name !== req?.body?.name) {
                const name = await Manager.findByIdAndUpdate(userId, { name: req.body.name });
                userUpdated = true;
            }
            if (req.body?.password && user?.password !== req?.body?.password) {
                const hashedPassword = await bcrypt.hash(req?.body?.password, 10);
                const password = await Manager.findByIdAndUpdate(userId, { password: hashedPassword });
                userUpdated = true;
            }
            if (req.body?.mobile && String(user?.mobile) !== String(req?.body?.mobile)) {
                const mobile = await Manager.findByIdAndUpdate(userId, { mobile: req.body.mobile });
                userUpdated = true;
            }
            if (req.body?.branch && user?.branch !== req?.body?.branch) {
                const branch = await Manager.findByIdAndUpdate(userId, { branch: req.body.branch });
                const notifyBranch = await Notification.findOneAndUpdate({ user: userId }, { branch: req.body.branch });
                userUpdated = true;
            }
            if (req.body?.address && user?.address !== req?.body?.address) {
                const address = await Manager.findByIdAndUpdate(userId, { address: req.body.address });
                userUpdated = true;
            }
            if (req.body?.designation && user?.designation !== req?.body?.designation) {
                const designation = await Manager.findByIdAndUpdate(userId, { designation: req.body.designation });
                userUpdated = true;
            }
            if (req?.file) {
                const imageUrl = `https://tms-2bk0.onrender.com/file/${req.file.originalname}`;
                const profile = await Manager.findByIdAndUpdate(userId, { profile: imageUrl });
                userUpdated = true;
            }
        }

        if (req.body.designation === 'Team Leader') {
            user = await TeamLeader.findById(userId);
            if (req.body?.username && user?.username !== req?.body?.username) {
                await Department.findOneAndUpdate({ teamleader: user?.username }, { teamleader: req.body.username });
                const username = await TeamLeader.findByIdAndUpdate(userId, { username: req.body.username });
                userUpdated = true;
            }
            if (req.body?.email && user?.email !== req?.body?.email) {
                const username = await TeamLeader.findByIdAndUpdate(userId, { email: req.body.email });
                userUpdated = true;
            }
            if (req.body?.name && user?.name !== req?.body?.name) {
                const name = await TeamLeader.findByIdAndUpdate(userId, { name: req.body.name });
                userUpdated = true;
            }
            if (req.body?.password && user?.password !== req?.body?.password) {
                const hashedPassword = await bcrypt.hash(req?.body?.password, 10);
                const password = await TeamLeader.findByIdAndUpdate(userId, { password: hashedPassword });
                userUpdated = true;
            }
            if (req.body?.mobile && String(user?.mobile) !== String(req?.body?.mobile)) {
                const mobile = await TeamLeader.findByIdAndUpdate(userId, { mobile: req.body.mobile });
                userUpdated = true;
            }
            if (req.body?.branch && user?.branch !== req?.body?.branch) {
                const branch = await TeamLeader.findByIdAndUpdate(userId, { branch: req.body.branch });
                const notifyBranch = await Notification.findOneAndUpdate({ user: userId }, { branch: req.body.branch });
                userUpdated = true;
            }
            if (req.body?.department && user?.department !== req?.body?.department) {
                const department = await TeamLeader.findByIdAndUpdate(userId, { department: req.body.department });
                const notifyDepartment = await Notification.findOneAndUpdate({ user: userId }, { dept: req.body.department });
                userUpdated = true;
            }
            if (req.body?.address && user?.address !== req?.body?.address) {
                const address = await TeamLeader.findByIdAndUpdate(userId, { address: req.body.address });
                userUpdated = true;
            }
            if (req.body?.designation && user?.designation !== req?.body?.designation) {
                const designation = await TeamLeader.findByIdAndUpdate(userId, { designation: req.body.designation });
                userUpdated = true;
            }
            if (req?.file) {
                const imageUrl = `https://tms-2bk0.onrender.com/file/${req.file.originalname}`;
                const profile = await TeamLeader.findByIdAndUpdate(userId, { profile: imageUrl });
                userUpdated = true;
            }
        }

        if (req.body.designation === 'admin') {
            user = await Admin.findById(userId);
            if (req.body?.username && user?.username !== req?.body?.username) {
                const branch = await Branch.findOneAndUpdate({ admin: user?.username }, { admin: req.body.username });
                const username = await Admin.findByIdAndUpdate(userId, { username: req.body.username });
                userUpdated = true;
            }
            if (req.body?.email && user?.email !== req?.body?.email) {
                const username = await Admin.findByIdAndUpdate(userId, { email: req.body.email });
                userUpdated = true;
            }
            if (req.body?.name && user?.name !== req?.body?.name) {
                const name = await Admin.findByIdAndUpdate(userId, { name: req.body.name });
                userUpdated = true;
            }
            if (req.body?.password && user?.password !== req?.body?.password) {
                const hashedPassword = await bcrypt.hash(req?.body?.password, 10);
                const password = await Admin.findByIdAndUpdate(userId, { password: hashedPassword });
                userUpdated = true;
            }
            if (req.body?.mobile && String(user?.mobile) !== String(req?.body?.mobile)) {
                const mobile = await Admin.findByIdAndUpdate(userId, { mobile: req.body.mobile });
                userUpdated = true;
            }
            if (req.body?.branches) {
                // Normalize to array
                if (!Array.isArray(req.body.branches)) {
                    req.body.branches = [req.body.branches];
                }

                // Clean comma-separated strings
                req.body.branches = req.body.branches
                    .flatMap(b => b.split(','))
                    .map(b => b.trim())
                    .filter(Boolean);

                // Compare old and new branches deeply
                const isSameBranches = JSON.stringify(user?.branches?.sort()) === JSON.stringify(req.body.branches?.sort());

                if (!isSameBranches && req.body.branches.length > 0) {

                    await Branch.updateMany(
                        { name: { $in: req.body.branches } },
                        { $set: { admin: req.body.username } }
                    );

                    const cleanBranches = req.body.branches;

                    await Admin.findByIdAndUpdate(
                        userId,
                        { $addToSet: { branches: { $each: cleanBranches } } },
                        { new: true }
                    );

                    await Notification.findOneAndUpdate(
                        { user: userId },
                        { $addToSet: { branches: { $each: cleanBranches } } },
                        { new: true }
                    );

                    userUpdated = true;
                }
            }

            if (req.body?.address && user?.address !== req?.body?.address) {
                const address = await Admin.findByIdAndUpdate(userId, { address: req.body.address });
                userUpdated = true;
            }
            if (req.body?.designation && user?.designation !== req?.body?.designation) {
                const designation = await Admin.findByIdAndUpdate(userId, { designation: req.body.designation });
                userUpdated = true;
            }
            if (req?.file) {
                const imageUrl = `https://tms-2bk0.onrender.com/file/${req.file.originalname}`;
                const profile = await Admin.findByIdAndUpdate(userId, { profile: imageUrl });
                userUpdated = true;
            }
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
        if (req.body.teamleader) {
            await TeamLeader.findOneAndUpdate({ username: req.body.teamleader }, { department: req.body.name });
        }
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
        if (req.body?.branch && user?.branch !== req?.body?.branch) {
            const branch = await Department.findByIdAndUpdate(departmentId, { branch: req.body.branch });
            userUpdated = true;
        }
        if (req.body?.teamleader && user?.teamleader !== req?.body?.teamleader) {
            const prevdept = await Department.findOneAndUpdate({ teamleader: req.body.teamleader }, { teamleader: '' });
            const teamleader = await Department.findByIdAndUpdate(departmentId, { teamleader: req.body.teamleader });
            const tl = await TeamLeader.findOneAndUpdate({ username: user?.teamleader }, { department: '' })
            const us = await TeamLeader.findOneAndUpdate({ username: req.body.teamleader }, { department: user?.name });
            const notifyDepartment = await Notification.findOneAndUpdate({ user: us._id }, { dept: user?.name });
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

export const getManagers = async (req, res) => {
    try {
        const allBranchesData = await Manager.find().select('-password');
        res.status(200).json({
            success: true,
            allBranchesData
        });
    } catch (error) {
        console.log('While get all admins', error);
    }
}

export const getTeamLeaders = async (req, res) => {
    try {
        const allBranchesData = await TeamLeader.find().select('-password');
        res.status(200).json({
            success: true,
            allBranchesData
        });
    } catch (error) {
        console.log('While get all admins', error);
    }
}

export const getExecutives = async (req, res) => {
    try {
        const allBranchesData = await User.find().select('-password');
        res.status(200).json({
            success: true,
            allBranchesData
        });
    } catch (error) {
        console.log('While get all admins', error);
    }
}