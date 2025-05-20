import express from 'express';
import { addCommentOnTicket, getAllTickets, raiseTicket, reAssignTheTicket, updateTicketStatus } from '../controllers/executiveController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const app = express();

app.post('/raiseticket', isAuthenticated, raiseTicket);
app.get('/getalltickets',isAuthenticated, getAllTickets);
app.post('/updateticketstatus', isAuthenticated, updateTicketStatus);
app.post('/addcommentonticket', isAuthenticated, addCommentOnTicket);
app.post('/ticketreassign', isAuthenticated, reAssignTheTicket);

export default app;