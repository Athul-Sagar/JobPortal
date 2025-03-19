import express from 'express';
import { upload } from '../middlewares/multerMiddleware.js'; // Ensure upload is correctly imported
import { 
    applyForJob, 
    getUser, 
    getUserJobApplication, 
    Login, 
    Register, 
    updateUserResume 
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register route with file upload
router.post("/register", (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}, Register);

// Login route
router.post("/login", express.json(), Login);

// Get current user data (protected route)
router.get("/me", authMiddleware, getUser);

// Apply for a job
router.post("/apply",authMiddleware, applyForJob);

// Get applied jobs data
router.get('/applications',authMiddleware, getUserJobApplication);

// Update user resume (protected + file upload)
router.put('/update-resume', authMiddleware, (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}, updateUserResume);

export default router;
