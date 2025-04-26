import express from 'express'
import { findUserForForgetPass, login, logout, reqForUpdatePassword, verifySuperAdmin } from '../controllers/authController.js';

const app = express();

app.get('/findemail/:email', findUserForForgetPass);
app.post('/reqforupdatepassword', reqForUpdatePassword);
app.post('/login', login);
app.get('/logout', logout);
app.get('/verifysuperadmin',verifySuperAdmin);

export default app;