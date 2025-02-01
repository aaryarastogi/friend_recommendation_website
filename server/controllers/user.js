import User from '../models/user.js';
import bcrypt from 'bcrypt';

export async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Kindly fill all details!" });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleUserSignin(req, res) {
    const { email, password } = req.body;

    try {
        const check = await User.findOne({ email }); // Check if user exists

        if (!check) {
            return res.status(404).json({ message: "not exist" });
        }
        const isPwdMatch = await bcrypt.compare(password, check.password);

        if (!isPwdMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = await check.generateAuthToken();
        if (!token) {
            return res.status(500).json({ message: "Token generation failed" });
        }
        // Set the cookie first
        res.cookie("jwtAuth", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true,
        });
        // Return a proper JSON response
        return res.status(200).json({ message: "exist", token , email: email , password: password});

    } catch (e) {
        console.error("Error during sign-in:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function fetchAllUsers(req,res){
    try {
    const currentUserEmail = req.users;
    const users = await User.find({ email: { $ne: currentUserEmail } });

    if (!users) {
        return res.status(404).json({ success: false, message: "No users found." });
    }

    return res.status(200).json({ success: true, users });
    } catch (error) {
    console.log("Error fetching users:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
    }
}


export async function getUserDetails(req,res){
    try{
        const mailid = req.body;
        const user = await User.findOne({email: req.user.user.email});

        return res.status(200).json({message: "fine..." , user});
    }
    catch(e){
        console.log("error while fetching user details", e.message);
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}

export async function handleRemoveFriend(req, res) {
    const { currentUserEmail, friendEmail } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: currentUserEmail },  
            { $pull: { friends: { email: friendEmail } } }, 
            { new: true }
        );
        await User.findOneAndUpdate(
            { email: friendEmail },
            { $pull: { friends: { email: currentUserEmail } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Friend removed successfully",
            updatedUser,
        });
    } catch (e) {
        console.log("Error while removing friend", e.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}