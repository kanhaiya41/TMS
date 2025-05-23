import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import UserRequests from '../models/reqModel.js';
import Branch from '../models/branchModel.js';
import Admin from '../models/adminModel.js';
import Notification from '../models/notificationModel.js';
import Manager from '../models/managerModel.js';
import TeamLeader from '../models/teamLeaderModel.js';
import Tickets from '../models/ticketModel.js';
import UserEditRequests from '../models/userReqModel.js';
import Department from '../models/departmentModel.js';
import TicketSettings from '../models/ticketSetingsModel.js';

export const makeAdmin = async (req, res) => {
    try {
        let { username, email, name, password, mobile, branches, address, designation } = req.body;

        if (branches) {
            if (!Array.isArray(branches)) {
                branches = [branches]; // agar ek hi branch aaye to bhi array bana lo
            }
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

        if (branches && branches.length > 0) {
            const updateResult = await Branch.updateMany(
                { name: { $in: branches } },
                { $set: { admin: username } }
            );
        }

        const user = await Admin({ username, email, name, password: hashedPassword, mobile, branches, address, profile: imageUrl, designation });
        const us = await user.save();
        if (branches && branches.length > 0) {
            const inputBranches = branches; // array from your request

            const existingDoc = await TicketSettings.findOne({ branches: { $in: inputBranches } });

            if (existingDoc) {
                const existingBranches = existingDoc.branches;

                // 1️⃣ Split branches
                const matchingBranches = existingBranches.filter(branch => inputBranches.includes(branch));
                const nonMatchingBranches = existingBranches.filter(branch => !inputBranches.includes(branch));

                // 2️⃣ Update original document with non-matching branches
                await TicketSettings.updateOne(
                    { _id: existingDoc._id },
                    { $set: { branches: nonMatchingBranches } }
                );

                // 3️⃣ Create a new document with matching branches and updated adminId
                const newDoc = await TicketSettings.create({
                    ...existingDoc.toObject(), // copy existing data
                    _id: undefined,            // remove _id so MongoDB creates a new one
                    branches: matchingBranches,
                    adminId: us._id
                });
            }
        }
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
        if (req?.body?.admin) {
            const updateAdmin = await Admin.findOneAndUpdate(
                { username: req.body.admin },
                { $addToSet: { branches: req.body.name } },
                { new: true }
            )
            await TicketSettings.updateOne(
                { adminId: updateAdmin._id },
                { $addToSet: { branches: req.body.name } }
            )
        }
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
    try {
        const branchId = req.body.branchid;
        const branch = await Branch.findById(branchId);

        if (!branch) {
            return res.status(404).json({ success: false, message: "Branch not found!" });
        }

        let branchUpdated = false;

        // ✅ Update Branch Name
        if (req.body?.name && branch?.name !== req.body.name) {
            const oldBranch = branch.name;
            const newBranch = req.body.name;

            await Branch.findByIdAndUpdate(branchId, { name: newBranch });

            await Admin.findOneAndUpdate(
                { branches: oldBranch },
                { $set: { "branches.$": newBranch } },
                { new: true }
            );

            branchUpdated = true;
        }

        // ✅ Update Location
        if (req.body?.location && branch?.location !== req.body.location) {
            await Branch.findByIdAndUpdate(branchId, { location: req.body.location });
            branchUpdated = true;
        }

        // ✅ Update Admin
        if (String(branch?.admin) !== String(req.body.admin)) {
            const oldAdmin = await Admin.findOne({ branches: branch.name });
            const newAdmin = await Admin.findOne({ username: req.body.admin });

            if (!newAdmin) {
                return res.status(404).json({ success: false, message: "New admin not found!" });
            }

            // Update branch document
            const adminBranch = await Branch.findByIdAndUpdate(
                branchId,
                { admin: req.body.admin }
            );

            // Remove branch from old admin
            if (oldAdmin) {
                await Admin.findByIdAndUpdate(
                    oldAdmin._id,
                    { $pull: { branches: branch.name } }
                );

                await Notification.findOneAndUpdate(
                    { user: oldAdmin._id },
                    { $pull: { branches: branch.name } }
                );
            }

            // Add branch to new admin
            await Admin.findByIdAndUpdate(
                newAdmin._id,
                { $addToSet: { branches: branch.name } }
            );

            const realData = await TicketSettings.findOneAndUpdate(
                { branches: branch.name },
                { $pull: { branches: branch.name } }
            );

            const newadminticketSettings = await TicketSettings.findOne({ adminId: newAdmin._id });
            if (newadminticketSettings) {
                await TicketSettings.updateOne(
                    { adminId: newAdmin._id },
                    { $addToSet: { branches: branch.name } }
                );
            }
            else {
                if (realData) {
                    const newDoc = await TicketSettings.create({
                        ...realData.toObject(), // copy existing data
                        _id: undefined,            // remove _id so MongoDB creates a new one
                        branches: branch.name,
                        adminId: newAdmin._id
                    });
                }
            }

            await Notification.findOneAndUpdate(
                { user: newAdmin._id },
                {
                    $addToSet: {
                        branches: {
                            $each: Array.isArray(req.body.branches)
                                ? req.body.branches
                                : [req.body.branches]
                        }
                    }
                },
                { new: true }
            );

            branchUpdated = true;
        }

        // ✅ Final response
        if (branchUpdated) {
            return res.status(200).json({
                success: true,
                message: "Branch Successfully Updated 👍"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "No Changes in Branch!"
            });
        }

    } catch (error) {
        console.error("Error while updating branch:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
};

export const deleteBranch = async (req, res) => {
    try {
        const id = req.params.id;
        const branch = await Branch.findByIdAndDelete(id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }

        // Clean-up
        await Admin.updateMany(
            { branches: branch.name },
            { $pull: { branches: branch.name } }
        );

        await Promise.all([
            Manager.deleteOne({ branch: branch.name }),
            TeamLeader.deleteMany({ branch: branch.name }),
            User.deleteMany({ branch: branch.name }),
            Tickets.deleteMany({ branch: branch.name }),
            UserRequests.deleteMany({ branch: branch.name }),
            UserEditRequests.deleteMany({ branch: branch.name }),
            Department.deleteMany({ branch: branch.name }),

            Notification.deleteMany({ branch: branch.name })
        ]);

        const tsData = await TicketSettings.findOneAndUpdate(
            { branches: branch.name },
            { $pull: { branches: branch.name } },
            { new: true }
        );

        if (tsData && !tsData.branches.length > 0) {
            await TicketSettings.findByIdAndDelete(tsData._id);
        }

        const notify = await Notification.findOneAndUpdate(
            { branches: branch.name },
            { $pull: { branches: branch.name } },
            { new: true }
        );

        if (notify && (!notify.branches || notify.branches.length === 0)) {
            await Notification.findByIdAndDelete(notify._id);
        }

        return res.status(200).json({
            success: true,
            message: 'Branch Deleted!'
        });

    } catch (error) {
        console.log("Error while deleting branch:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the branch"
        });
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await TicketSettings.findOneAndUpdate(
            { adminId: id },
            { adminId: '' },
            { new: true }
        );
        if (data?.branches && !data.branches.length > 0) {
            await TicketSettings.findByIdAndDelete(data._id);
        }
        const request = await Admin.findByIdAndDelete(id);
        await Notification.deleteOne({
            user: id
        });
        await Branch.updateMany(
            { name: { $in: request.branches } },
            { admin: '' }
        )
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