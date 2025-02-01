import express from "express";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.js";
import cors from "cors";
import { authenticateToken } from "./middleware/auth.js";

const app = express();

// Middleware
app.use(express.json()); // Parses JSON requests
app.use(cors());

// Default route
app.use("/api/users", userRoute);

app.get('/user', authenticateToken, async(req, res) => {
    try{
        const userData=await collection.findOne({_id:req.user.user._id});
        if(userData){
            return res.status(200).json({success:true,user:userData})
        }else{
            console.log('userdata failed');
        }
    }catch(e){
        console.log('/user not working',e.message);
        return res.status(400).json({success:false})
    }
})

connectDB(process.env.USERNAME , process.env.PASSWORD); //connection of DB

const PORT=process.env.PORT || 8000;

app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));