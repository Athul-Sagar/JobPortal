import mongoose from "mongoose";

export const ConnectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database is connected Succesfully 👍")
    } catch (error) {

        console.log("Database is not connected 😔",error)
        console.log(error)
        
    }
}   