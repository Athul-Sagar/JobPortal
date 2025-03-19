import express from 'express'
import cors from  'cors'
import dotenv from 'dotenv'
import { ConnectDb } from './config/db.js';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import companyRoute from './routes/companyRoute.js';
import jobRouter from './routes/jobRoutes.js';

dotenv.config();
ConnectDb()

// initialize express

const app=express()
const corsOptions = {
    origin: 'https://jobportalbyathul.netlify.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }; 
 

  app.use(express.json()); // Must come first
  app.use(cookieParser());
  app.use(cors(corsOptions));

app.use("/uploads", express.static("uploads"));
const PORT=process.env.PORT 


app.use("/api/auth",userRouter)
app.use("/api/company",companyRoute)
app.use("/api/jobs",jobRouter)


app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

