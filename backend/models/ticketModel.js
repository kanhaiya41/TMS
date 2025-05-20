import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    name: String,
    subject: String,
    mobile: Number,
    category: String,
    priority: String,
    tat: String,
    department: [
        {
            name: String,
            description: String,
            users: Array
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