import Branch from "../models/branchModel.js";
import Tickets from "../models/ticketModel.js";


export const raiseTicket = async (req, res) => {
    try {

        const data = await Tickets(req.body);
        const saveddata = await data.save();
        const ticketLength = await Tickets.countDocuments();
        const updateBranch = await Branch.findOneAndUpdate({ name: req.body.branch }, { tickets: ticketLength })
        if (saveddata) {
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