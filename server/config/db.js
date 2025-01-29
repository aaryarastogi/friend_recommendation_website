import mongoose from "mongoose";

export const connectDB=async(username,pwd)=>{
    const URL= `mongodb+srv://friend:system@cluster0.edfto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    try {
        await mongoose.connect(URL,{});
        console.log('connected to mongodb')
    } catch (error) {
        console.log('error while connecting with database',error.message);
    }
}

export default connectDB;