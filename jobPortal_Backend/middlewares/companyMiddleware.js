import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Company from '../models/companyModel.js';

const companyMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.companyToken;

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);  // Debugging log

        // Use `companyId` instead of `id`
        const companyId = decoded.companyId;

        // Check if companyId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid company ID format." });
        }

        // Fetch company from database
        const company = await Company.findById(companyId).select('-password');

        if (!company) {
            return res.status(404).json({ message: "Company not found in database." });
        }

        req.company = company;
        next();
    } catch (error) {
        console.error("Company Middleware Error:", error);
        res.status(400).json({ message: "Invalid token or server error." });
    }
};

export default companyMiddleware;
