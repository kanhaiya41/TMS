import express from 'express';
import { upload, uploadToGridFs } from '../middlewares/uploadToGFS.js';
import { addTicketSettings, addUser, createDepartment, deleteDepartment, deleteTicketSettings, deleteUpdateRequest, deleteUser, deleteUserEditRequest, getDepartments, getExecutives, getManagers, getTeamLeaders, getTicketSettings, updateDepartment, updateTicketSettings, updateUser } from '../controllers/adminController..js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const app = express();

app.post('/adduser', isAuthenticated, upload.single('profile'), uploadToGridFs, addUser);
app.delete('/deleteupdaterequest/:id', isAuthenticated, deleteUpdateRequest);
app.delete('/deleteusereditrequest/:id', isAuthenticated, deleteUserEditRequest);
app.post('/updateuser', isAuthenticated, upload.single('profile'), uploadToGridFs, updateUser);
app.delete('/deleteuser/:id', isAuthenticated, deleteUser);
app.post('/createdepartment', isAuthenticated, createDepartment);
app.get('/department', getDepartments);
app.delete('/deletedepartment/:id', isAuthenticated, deleteDepartment);
app.post('/updatedepartment', isAuthenticated, updateDepartment);
app.get('/managers', getManagers);
app.get('/teamleaders', getTeamLeaders);
app.get('/executives', getExecutives);
app.post('/addticketsettings', isAuthenticated, addTicketSettings);
app.get('/getticketsettings/:branch', getTicketSettings);
app.post('/updateticketsettings', isAuthenticated, updateTicketSettings);
app.post('/deleteticketsettings', isAuthenticated, deleteTicketSettings);

export default app;