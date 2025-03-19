import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // ✅ Import bcrypt

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    companyImage: {
        type: String, // ✅ Store image URL/path
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// ✅ Hash password before saving
companySchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ✅ Compare passwords correctly
companySchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const Company = mongoose.model('Company', companySchema);

export default Company;
