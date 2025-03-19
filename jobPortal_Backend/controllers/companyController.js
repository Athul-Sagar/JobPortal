import express from "express";
import Company from "../models/companyModel.js";
import jwt from 'jsonwebtoken'
import Job from "../models/jobModel.js";
import jobApplication from "../models/jobApplicationModel.js";

export const registerCompany = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!req.files?.companyImage) {
            return res.status(400).json({ 
                success: false,
                message: "Company logo/image is required" 
            });
        }

        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ 
                success: false,
                message: "Company already exists" 
            });
        }

        const companyImagePath = req.files.companyImage[0].path;
        const newCompany = new Company({ name, email, password, companyImage: companyImagePath });
        await newCompany.save();

        const token = jwt.sign(
            { companyId: newCompany._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("companyToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "Company registered successfully",
            company: {
                _id: newCompany._id,
                name: newCompany.name,
                email: newCompany.email,
                companyImage: newCompany.companyImage
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "Server error", 
            error: error.message 
        });
    }
};
// company login 

export const loginCompany = async (req, res) => {
    try {
        // 1. Validate request body
        if (!req.body?.email?.trim() || !req.body?.password?.trim()) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            });
        }

        const { email, password } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        // 2. Find company with case-insensitive search
        const existingCompany = await Company.findOne({ 
            email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') }
        });

        if (!existingCompany) {
            return res.status(404).json({ 
                success: false,
                message: "Company not found" 
            });
        }

        // 3. Add password comparison logic (you'll need to implement this)
        // const isMatch = await bcrypt.compare(password, existingCompany.password);
        // if (!isMatch) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Invalid credentials"
        //     });
        // }

        // 4. Generate JWT token
        const token = jwt.sign(
            { companyId: existingCompany._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5. Set cookie
        res.cookie("companyToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // 6. Send proper success response
        res.status(200).json({
            success: true,
            message: "Login Successful", // Fixed spelling
            company: {  // Optional: Include basic company info
                _id: existingCompany._id,
                name: existingCompany.name,
                email: existingCompany.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const LogoutCompany = async (req, res) => {
    try {
        res.cookie("companyToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(0) // Expire the cookie immediately
        });

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// get Company data 

export const getCompanyData=async(req,res)=>{

    try {
    const companyId=req.company._id

    

    const company=await Company.findById(companyId).select("-password")

    if(!company){
        return res.json({success:false,message:"Company is not exist"})
    }

    res.json(company)


        
    } catch (error) {

         console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
        
    }


    

   

    





}

// Post a new job 

export const postJob=async(req,res)=>{

    
        const {title,description,location,salary,level,category}=req.body

    const companyId=req.company._id

   try {

    const newJob=new Job({
        title,
        description,
        location,
        salary,
        companyId,
        date:Date.now(),
        level,
         category
    })

    await newJob.save()

    res.json({success:true,newJob})
    

   } catch (error) {

    console.log(error)
    res.json({message:error})
    
   }
        
   
}

// get company job application 

export const getCompanyJobApplication=async(req,res)=>{

    try {
        
        const companyId=req.company._id

        // Find job Applications for the user and populate related data
        const applications=await jobApplication.find({companyId})
        .populate('userId','name image  resume')
        .populate('jobId','title location category level salary')
        .exec()

        return res.json({success:true,applications})


    } catch (error) {

        res.json({success:false,message:error.message})
        
    }

   
}

// get company posted jobs 

export const getCompanyPostedJobs=async(req,res)=>{

    try {

        const companyId=req.company._id

        const jobs=await Job.find({companyId})

        const jobsData=await Promise.all(jobs.map(async(job)=>{
            const applicants=await jobApplication.find({jobId:job._id})
            return {...job.toObject(),applicants:applicants.length
            }
        }))



        res.json({success:true,jobsData})
        


    } catch (error) {

        res.json({success:false,message:error.message}) 
        
    }


}

// change job Application status 

export const ChangeJobApplicationStatus=async(req,res)=>{

   try {

    const {id, status}=req.body


    await jobApplication.findOneAndUpdate({_id:id},{status})

    res.json({success:true,message:'status Changed'})
    
   } catch (error) {

    res.json({success:false,message:error.message})
    
   }



}


// change job visibilitey 

export const changeVisibility=async(req,res)=>{

    try {

        const {id}=req.body

        const companyId=req.company._id

        const job=await Job.findById(id)

        if(companyId.toString()===job.companyId.toString()){

            job.visible=!job.visible

        }

        await job.save()
 
        res.json({success:true,job})


        
    } catch (error) {

        res.json({success:false,message:error.message})
        
    }

}