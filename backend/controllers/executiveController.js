import Branch from "../models/branchModel.js";
import Manager from "../models/managerModel.js";
import TeamLeader from "../models/teamLeaderModel.js";
import Tickets from "../models/ticketModel.js";
import nodemailer from 'nodemailer';
import User from "../models/userModel.js";



export const raiseTicket = async (req, res) => {
    try {
        const data = await Tickets(req.body);
        const saveddata = await data.save();

        const ticketLength = await Tickets.countDocuments();
        const updateBranch = await Branch.findOneAndUpdate({ name: req.body.branch }, { tickets: ticketLength })
        if (saveddata) {
            const deptNames = req.body.department.map(dep => dep.name);

            const emails = await TeamLeader.find({
                branch: req.body.branch,
                department: { $in: deptNames }
            });

            const manageremail = await Manager.findOne({ branch: req.body.branch });
            //set nodemailer transport
            const transtporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.EMAIL_PASS
                }
            });
            const mailBody = {
                from: process.env.USER_EMAIL,
                to: manageremail.email,
                subject: 'New Ticket Raised in Your Branch',
                html: `<p>Name: ${saveddata?.name} <br>
                Subject: ${saveddata?.subject} <br>
                Mobile: ${saveddata?.mobile} <br> 
                Email Address: ${saveddata?.email} <br>
                Priority: ${saveddata?.priority} <br>
                ${saveddata.department.map(dept =>
                    `${dept?.name} : ${dept?.description} <br>`
                )}
                </p>`
            };
            await transtporter.sendMail(mailBody);

            await Promise.all(emails.map(async (curElem) => {
                const mailBody = {
                    from: process.env.USER_EMAIL,
                    to: curElem.email,
                    subject: 'New Ticket Raised in Your Department',
                    html: `<p>
                    Name: ${saveddata?.name} <br>
                    Subject: ${saveddata?.subject} <br>
                    Mobile: ${saveddata?.mobile} <br> 
                    Email Address: ${saveddata?.email} <br>
                    Priority: ${saveddata?.priority} <br>
                    Description: ${saveddata?.department?.find(dept => dept?.name === curElem?.department)?.description || 'N/A'}
                  </p>`,
                };
                await transtporter.sendMail(mailBody);
            }));

            return res.status(200).json({
                success: true,
                message: 'Ticket Raised Succssfull!😊'
            });
        }
        else {
            return res.status(400).json({
                success: true,
                message: 'error occure!🙏'
            });
        }
    } catch (error) {
        console.log("while raising a ticket", error);
        res?.status(500).json({
            success: false,
            message: `Error While Raising a Ticket Contact Admin`
        })
    }
}

export const getAllTickets = async (req, res) => {
    try {
        const data = await Tickets.find();
        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.log('While geting all tickets', error);
    }
}

export const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId, status } = req.body;
        const updated = await Tickets.findByIdAndUpdate(ticketId, { status: status });
        const ticket = await Tickets.findById(ticketId);
        let executive = await User.findOne({ username: ticket?.issuedby });
        if (!executive) {
            executive = await TeamLeader.findOne({ username: ticket?.issuedby });
        }
        if(!executive)
        {
            executive = await Manager.findOne({ username: ticket?.issuedby });
        }
        if (status === 'resolved') {
            //set nodemailer transport
            const transtporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.EMAIL_PASS
                }
            });
            const mailBody = {
                from: process.env.USER_EMAIL,
                to: ticket.email,
                cc: executive.email,
                subject: 'Your Ticket is Resolved',
                html: `<p>Name: ${ticket?.name} <br>
                Subject: ${ticket?.subject} <br>
                Mobile: ${ticket?.mobile} <br> 
                Email Address: ${ticket?.email} <br>
                Priority: ${ticket?.priority} <br>
                ${ticket.department.map(dept =>
                    `${dept?.name} : ${dept?.description} <br>`
                )}
                </p>`,
            };
            await transtporter.sendMail(mailBody);
        }
        if (updated) {
            return res.status(200).json({
                success: true,
                message: `Ticket ${status}`
            })
        }
    } catch (error) {
        console.log("while ticket updation", error);
    }
}

export const addCommentOnTicket = async (req, res) => {
    try {
        const { ticketId, comment, commenter } = req.body;
        const updated = await Tickets.findByIdAndUpdate(ticketId, {
            $push: { comments: { content: comment, commenter: commenter } }
        },
            { new: true }
        )
        if (updated) {
            return res.status(200).json({
                success: true,
                message: 'Comment Added!'
            })
        }
    } catch (error) {
        console.log("while add comment on ticket", error);
    }
}

export const reAssignTheTicket = async (req, res) => {
    try {
        const ticket = await Tickets.findByIdAndUpdate(req.body.ticketId, { $push: { deptinvolve: { name: req.body.presentDept } }, department: req.body.reAssignto });
        if (ticket) {
            return res.status(200).json({
                success: true,
                message: `Ticket Assign to ${req.body.reAssignto}!`
            })
        }
    } catch (error) {
        console.log('while reassigning ticket', error);
    }
}