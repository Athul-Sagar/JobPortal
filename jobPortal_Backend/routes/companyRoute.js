import express from 'express'
import { ChangeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplication, getCompanyPostedJobs, loginCompany, LogoutCompany, postJob, registerCompany } from '../controllers/companyController.js';
import upload from '../middlewares/multerMiddleware.js';
import companyMiddleware from '../middlewares/companyMiddleware.js';


const router=express.Router();


router.post('/register',upload,registerCompany)

router.post('/login',loginCompany),

router.post('/logout',LogoutCompany), 


router.get('/company',companyMiddleware,getCompanyData)

router.post('/post-job',companyMiddleware,postJob)

router.get('/applicants',companyMiddleware,getCompanyJobApplication)

router.get('/list-jobs',companyMiddleware,getCompanyPostedJobs)

router.post('/change-status',companyMiddleware,ChangeJobApplicationStatus)

router.post('/change-visiblity',companyMiddleware,changeVisibility)

export default router


