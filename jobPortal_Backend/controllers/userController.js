import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt, { genSalt } from 'bcrypt'
import { application } from "express";
import jobApplication from "../models/jobApplicationModel.js";
import Job from "../models/jobModel.js";

export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists  
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already Exists" });
        }

        // ❌ REMOVE manual hashing - Mongoose will hash it
        const resumePath = req.files['resume'] ? req.files["resume"][0].path : null;
        const imagePath = req.files['image'] ? req.files["image"][0].path : null;

        const newUser = new User({
            name,
            email,
            password,  // ✅ Let Mongoose middleware handle hashing
            resume: resumePath,
            image: imagePath
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Ensure password comparison works correctly
        const isMatch = await existingUser.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Set the token in HTTP-only cookies
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getUser = async (req, res) => {
    try {
        const token = req.cookies.authToken; // ✅ Corrected cookie name
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Apply for a job 

export const applyForJob=async(req,res)=>{

    const {jobId}=req.body

    const userId=req.user.userId 

    try {

        const isAlreadyApplied=await jobApplication.find({jobId,userId})

        if(isAlreadyApplied.length>0){
            return res.json({success:false,message:'Already Applied'})
        }

        const jobData=await Job.findById(jobId)

        if(!jobData){
            return res.json({success:false,message:'Job Not Found'})
        }

        await jobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now()
        })

        res.json({success:true,message:'Applied Succefully'})
        


    } catch (error) {

        res.json({success:false,message:error.message})
        
    }

}

// get user applied application 

export const getUserJobApplication = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        // Fetch job applications
        const applications = await jobApplication.find({ userId })
            .populate("companyId", "name email companyImage")
            .populate("jobId", "title description location category level salary")
            .exec();

        if (!applications || applications.length === 0) {
            return res.status(404).json({ success: false, message: "No job applications found" });
        }

        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// update user profile 



export const updateUserResume = async (req, res) => {
    try {
        console.log("req.user:", req.user); // Debugging output

        if (!req.files || !req.files.resume) {
            return res.status(400).json({ message: "No resume file uploaded" });
        }

        const userId = req.user.userId; // ✅ Use `userId` instead of `id`
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing from token" });
        }

        const resumePath = `/uploads/resumes/${req.files.resume[0].filename}`;
        const updatedUser = await User.findByIdAndUpdate(userId, { resume: resumePath }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Resume updated successfully", resume: updatedUser.resume });
    } catch (error) {
        console.error("Error updating resume:", error);
        res.status(500).json({ message: "Server error" });
    }
};
