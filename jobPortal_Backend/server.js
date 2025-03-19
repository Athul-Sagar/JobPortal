import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ConnectDb } from './config/db.js';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import companyRoute from './routes/companyRoute.js';
import jobRouter from './routes/jobRoutes.js';

dotenv.config();
ConnectDb();

// Initialize express
const app = express();

// ✅ CORS FIX: Correctly set allowed origins
const allowedOrigins = [
  'https://jobportalbyathul.netlify.app',  // ✅ Production frontend
  'http://localhost:5173'  // ✅ For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Apply CORS middleware first
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT;

app.use("/api/auth", userRouter);
app.use("/api/company", companyRoute);
app.use("/api/jobs", jobRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
