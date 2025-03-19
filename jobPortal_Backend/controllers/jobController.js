


// Get all jobs 

import Job from "../models/jobModel.js"

export const getJobs=async(req,res)=>{

    try {
        const  jobs=await Job.find({visible:true})
        .populate({path:'companyId',select:'-password'})

        res.json({success:true,jobs})
    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
        
    }


}


// Get a Single Job by Id 

export const getJobById=async(req,res)=>{

    try {
        const {id}=req.params

        const job=await Job.findById(id)
        .populate({
            path:"companyId",
            select:"-password"
        })

        if(!job){
            return res.json({sucess:false,message:"job not found"})
        }

        res.json({success:true,job})
    } catch (error) {
        console.log(error)
        res.json({success:true,message:error.message})
    }


}