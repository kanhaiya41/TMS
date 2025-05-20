import mongoose from "mongoose";


const settingSchema = new mongoose.Schema({
    categories: [
        {
            name: String,
            description: String
        }
    ],
    priorities: [
        {
            name: String,
            color: String,
            tat: String
        }
    ],
    adminId: String,
    branches: Array
});

const TicketSettings = new mongoose.model('ticket-setting', settingSchema);

export default TicketSettings;