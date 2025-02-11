

import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import  authRoute from "./routes/user.route.js"
import userData from "./routes/user.detail.route.js"

dotenv.config();

const allowedOrigins=[
    "http://localhost:5173",''
]

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true, origin:allowedOrigins}));



const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("App is listening on port", port);
})
main()
.then(()=>{
    console.log("Connect to data base ")
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/authenication');
}




app.use("/auth",authRoute);

app.use("/auth",userData);

app.get("/", (req, res) => {
    res.send("ok working")
})
