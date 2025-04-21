import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/dbConnect.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
