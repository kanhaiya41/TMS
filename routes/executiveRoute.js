import express from 'express';
import { addCommentOnTicket, getAllTickets, raiseTicket, reAssignTheTicket, updateTicketStatus } from '../controllers/executiveController.js';

const app = express();

app.post('/raiseticket', raiseTicket);
app.get('/getalltickets', getAllTickets);
app.post('/updateticketstatus', updateTicketStatus);
app.post('/addcommentonticket', addCommentOnTicket);
app.post('/ticketreassign', reAssignTheTicket);

export default app;