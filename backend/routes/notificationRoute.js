import express from 'express';
import { fetchNotifications, pushNotification, resolveNotification } from '../controllers/notificationController.js';

const app = express();

app.post('/getnotification', fetchNotifications);
app.post('/pushnotification', pushNotification);
app.post('/resolvenotification', resolveNotification);

export default app;