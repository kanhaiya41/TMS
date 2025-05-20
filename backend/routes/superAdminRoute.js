import express from 'express'
import { createBranch, deleteAdmin, deleteBranch, getAllAdmins, getBranches, getRequests, makeAdmin, updateBranch, updatePassword } from '../controllers/superAdminController.js';
import { upload, uploadToGridFs } from '../middlewares/uploadToGFS.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const app = express();

app.post('/makeadmin', isAuthenticated, upload.single('profile'), uploadToGridFs, makeAdmin);
app.get('/getadmins', getAllAdmins);
app.get('/getalladminrequests', getRequests);
app.post('/updatepassword', isAuthenticated, updatePassword);
app.post('/createbranch', isAuthenticated, createBranch);
app.get('/branches', getBranches);
app.post('/updatebranch', isAuthenticated, updateBranch);
app.delete('/deletebranch/:id', isAuthenticated, deleteBranch);
app.delete('/deleteadmin/:id', isAuthenticated, deleteAdmin);

export default app;