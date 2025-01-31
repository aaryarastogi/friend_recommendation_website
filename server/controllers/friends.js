import User from "../models/user.js"

export async function fetchFriends(req,res){
    const userEmail = req.body.email;
    try {
        const user = await User.findOne({email: userEmail}); // Get user from token
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ friends: user.friends });
    }
    catch(e){
        console.log("Error while fetching friends", e.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}