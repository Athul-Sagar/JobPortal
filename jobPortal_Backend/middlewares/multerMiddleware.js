import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const createUploadDirs = () => {
    const directories = ["uploads/resumes", "uploads/images", "uploads/companies"];
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// Run on initialization
createUploadDirs();

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "resume") {
            cb(null, "uploads/resumes/");
        } else if (file.fieldname === "image") {
            cb(null, "uploads/images/");
        } else if (file.fieldname === "companyImage") {
            cb(null, "uploads/companies/");
        } else {
            return cb(new Error("Invalid file field"), false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to allow only PDFs and images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

// Upload instance for multiple fields
export const upload = multer({ storage, fileFilter }).fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "companyImage", maxCount: 1 }
]);

// Separate upload function for only resume uploads
export const uploadResume = multer({ storage, fileFilter }).single("resume");

export default upload;
