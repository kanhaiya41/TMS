import User from "../models/userModel.js";
import UserRequests from "../models/reqModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const findUserForForgetPass = async (req, res) => {
    try {
        const email = req.params.email;
        const existReq = await UserRequests.findOne({ email });
        if (existReq) {
            res.status(400).json({
                success: false,
                message: 'Already Requested!',
                existReq
            });
        }
        else {
            const user = await User.findOne({ email }).select('-password');
            console.log(user)
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'You are not our User!',
                });
            }
            else {
                res.status(200).json({
                    success: true,
                    user
                });
            }
        }
    } catch (error) {
        console.log("while finding email", error);
    }
}

export const reqForUpdatePassword = async (req, res) => {
    try {

        const request = await UserRequests(req.body);
        const saveReq = await request.save();
        res.status(200).json({
            success: true,
            message: 'Request Sent Successfully! 😊'
        })
    } catch (error) {
        console.log("while requesting for password update", error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: 'something is missing,Please cheack!'
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password!'
            });
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password!'
            });
        }

        const token = jwt.sign({
            userId: user._id
        },
            process.env.SECRET_KEY,
            {
                expiresIn: '10h'
            }
        );
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 10 * 60 * 60 * 1000 }).json({
            success: true,
            message: `Welcome ${user?.username}`,
            user
        });


    } catch (error) {
        console.log("error while Login", error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie('token', "", { maxAge: 0 }).json({
            success: true,
            message: 'Logged out Successfully'
        })
    } catch (error) {
        console.log("error while logout", error);
    }
}

export const verifySuperAdmin = async (req, res) => {
    try {
        const designation = 'superadmin';
        const superadmin = await User.findOne({ designation });
        if (superadmin) {
            return res.status(200).json({
                success: true
            })
        }
        else {
            return res.status(400).json({
                success: false
            })
        }
    } catch (error) {
        console.log("while verify super admin", error);
    }
}