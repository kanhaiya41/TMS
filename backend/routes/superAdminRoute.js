import express from 'express'
import { createBranch, deleteAdmin, deleteBranch, getAllAdmins, getBranches, getRequests, makeAdmin, updateBranch, updatePassword } from '../controllers/superAdminController.js';
import { upload, uploadToGridFs } from '../middlewares/uploadToGFS.js';

const app = express();

app.post('/makeadmin', upload.single('profile'), uploadToGridFs, makeAdmin);
app.get('/getadmins', getAllAdmins);
app.get('/getalladminrequests', getRequests);
app.post('/updatepassword', updatePassword);
app.post('/createbranch', createBranch);
app.get('/branches', getBranches);
app.post('/updatebranch',updateBranch);
app.delete('/deletebranch/:id', deleteBranch);
app.delete('/deleteadmin/:id', deleteAdmin);

export default app;