import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required :true
        },
        email:{
            type:String,
            required :true,
            unique:true
        },
        password:{
            type:String,
            required :true
        },
        tokens:[
            {
                token:{
                    type:String,
                    required:true
                }
            }
        ],
        friends: [{ name: String, email: String }], // List of friends
        friendRequests: [{ name: String, email: String }], // Incoming friend requests
        sentRequests: [{ name: String, email: String }],
    },
    {timestamps:true}
)

userSchema.methods.generateAuthToken=async function () {
    try{
        let token=jwt.sign(
            {
                user:{
                _id:this._id , 
                name:this.name , 
                email:this.email
                }
            },"thisisafriendrecommendationsystem",{expiresIn:'24h'}
        )
        console.log("token /models/user.js file",this.name);
        this.tokens=[];
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(e){
        console.log("generate auth token failed",e);
    }
}

const User = mongoose.model("User",userSchema);
export default User;