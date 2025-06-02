import express from 'express';
import { addCommentOnTicket, getAllTickets, raiseTicket, reAssignTheTicket, updatePriority, updateTicketStatus } from '../controllers/executiveController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { upload, uploadToGridFs } from '../middlewares/uploadToGFS.js';

const app = express();

app.post('/raiseticket', isAuthenticated,upload.single('file'), uploadToGridFs, raiseTicket);
app.get('/getalltickets', isAuthenticated, getAllTickets);
app.post('/updateticketstatus', isAuthenticated, updateTicketStatus);
app.post('/addcommentonticket', isAuthenticated, addCommentOnTicket);
app.post('/ticketreassign', isAuthenticated, reAssignTheTicket);
app.post('/updatepriority', isAuthenticated, updatePriority);

export default app;