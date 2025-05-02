import express from 'express';
import { upload, uploadToGridFs } from '../middlewares/uploadToGFS.js';
import { addUser, createDepartment, deleteDepartment, deleteUpdateRequest, deleteUser, getDepartments, getExecutives, getManagers, getTeamLeaders, updateDepartment, updateUser } from '../controllers/adminController..js';

const app = express();

app.post('/adduser', upload.single('profile'), uploadToGridFs, addUser);
app.delete('/deleteupdaterequest/:id', deleteUpdateRequest);
app.post('/updateuser',upload.single('profile'),uploadToGridFs,updateUser);
app.delete('/deleteuser/:id', deleteUser);
app.post('/createdepartment', createDepartment);
app.get('/department', getDepartments);
app.delete('/deletedepartment/:id', deleteDepartment);
app.post('/updatedepartment',updateDepartment);
app.get('/managers',getManagers);
app.get('/teamleaders',getTeamLeaders);
app.get('/executives',getExecutives);

export default app;