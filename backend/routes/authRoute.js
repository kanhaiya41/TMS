import express from 'express'
import { fetchUpdateProfileRequests, findUserForForgetPass, login, logout, reqForUpdatePassword, reqToEditProfile, sendMail, superAdminSignUp, updateForgetPassword, updateStatustoProfileUpdateRequest, updateUserPassword, verifySuperAdmin } from '../controllers/authController.js';
import { upload, uploadToGridFs } from '../middlewares/uploadToGFS.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const app = express();

app.get('/findemail/:email', findUserForForgetPass);
app.post('/reqforupdatepassword', reqForUpdatePassword);
app.post('/login', login);
app.get('/logout', logout);
app.get('/verifysuperadmin', verifySuperAdmin);
app.post('/reqforupdateprofile', isAuthenticated, reqToEditProfile);
app.get('/getupdateprofilerequests', fetchUpdateProfileRequests);
app.post('/statusupdateforuserrequest', isAuthenticated, updateStatustoProfileUpdateRequest);
app.post('/superadminsignup', upload.single('profile'), uploadToGridFs, superAdminSignUp);
app.post('/mailforupdatepass', sendMail);
app.post('/updateforgetpass', updateForgetPassword);
app.post('/updatepassword', updateUserPassword);

export default app;