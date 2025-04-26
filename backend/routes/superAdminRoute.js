import express from 'express'
import { createBranch, deleteBranch, getAllBranches, getBranches, getRequests, makeAdmin, updateBranch, updatePassword } from '../controllers/superAdminController.js';
import { upload, uploadToGridFs } from '../middlewares/uploadToGFS.js';

const app = express();

app.post('/makeuser', upload.single('profile'), uploadToGridFs, makeAdmin);
//finding all users from db
app.get('/getbranches', getAllBranches);
app.get('/getalladminrequests', getRequests);
app.post('/updatepassword', updatePassword);
app.post('/createbranch', createBranch);
app.get('/branches', getBranches);
app.post('/updatebranch',updateBranch);
app.delete('/deletebranch/:id', deleteBranch);

export default app;