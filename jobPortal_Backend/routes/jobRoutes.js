import express from 'express'
import { getJobById, getJobs } from '../controllers/jobController.js'

const router=express.Router()


// Router get all jobs data 

router.get('/',getJobs)

// Router to get a single job by id 

router.get('/:id',getJobById)

export default router