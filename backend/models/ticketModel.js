import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    mobile: Number,
    date: Date,
    time: String,
    priority: String,
    department: [
        {
            name: String,
            description: String
        }
    ],
    issuedby: String,
    status: String,
    branch: String,
    comments: [
        {
            content: String,
            commenter: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Tickets = new mongoose.model('Ticket', ticketSchema);

export default Tickets;