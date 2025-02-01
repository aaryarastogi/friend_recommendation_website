import User from "../models/user.js"

export async function handleSendRequest(req, res) {
    const { senderEmail, receiverEmail } = req.body;
    try {
        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) { //checking if sender or receiver not exists
            return res.status(404).json({ message: "User not found" });
        }
        if (receiver.friendRequests.includes(senderEmail)) {
            return res.status(400).json({ message: "Request already sent" });
        }
        
        sender.sentRequests.push({
            name: receiver.name,
            email: receiver.email
        });
    
        // Add sender details in receiver's friendRequests
        receiver.friendRequests.push({
            name: sender.name,
            email: sender.email
        });

        await sender.save();
        await receiver.save();

        return res.status(200).json({ message: "Friend request sent!" , sender: sender , receiver: receiver });
    } catch (error) {
        console.error("Error in handleSendRequest:", error); // Log the full error
        return res.status(500).json({ message: "Server error" });
    }
}

export async function handleRemoveRequest(req, res) {
    const { senderEmail, receiverEmail } = req.body;
    try {
        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ email: receiverEmail });

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove receiver's email from sender's sentRequests
        sender.sentRequests = sender.sentRequests.filter(user => user.email !== receiverEmail);
        // Remove sender's email from receiver's friendRequests
        receiver.friendRequests = receiver.friendRequests.filter(user => user.email !== senderEmail);

        console.log("remove request")

        await sender.save();
        await receiver.save();

        return res.status(200).json({ message: "Friend request removed!" });
    } catch (error) {
        console.error("Error in handleRemoveRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
}
export async function  handleAcceptRequest(req,res) {
    const { currentUserEmail , requestSenderEmail} = req.body;
    try {
        const currentUser = await User.findOne({email: currentUserEmail});
        const sender = await User.findOne({email: requestSenderEmail});

        if (!currentUser || !sender) {
        return res.status(404).json({ message: "User not found" });
        }

        // Remove from friend requests
        currentUser.friendRequests = currentUser.friendRequests.filter(
            (user) => user.email!== requestSenderEmail
        );
        sender.sentRequests = sender.sentRequests.filter(
            (user) => user.email !== currentUserEmail
        );

        // Add as friends
        currentUser.friends.push({name: sender.name , email: sender.email});
        sender.friends.push({name: currentUser.name , email: currentUser.email});

        await currentUser.save();
        await sender.save();

        return res.status(200).json({ message: "Friend request accepted!" , currentUser: currentUser , sender: sender });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export async function fetchRequests(req, res) {
    const user = req.user.user;
    // console.log("fetch req: ", user.user);

    try{
        const loggedInUser = await User.findOne({email: user.email});
        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Send friend requests & sent requests in response
        return res.status(200).json({
            message: "Friend requests fetched successfully",
            friendRequests: loggedInUser.friendRequests, 
            sentRequests: loggedInUser.sentRequests,
            userDetails: {
                email: loggedInUser.email,
                name: loggedInUser.name,
                friends: loggedInUser.friends, // Assuming you have a friends list
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching requests..." });
    }
  }

  export async function deleteUserRequest(req, res) {
    const { currentUserEmail, userEmail } = req.body;

    try {
        const user = await User.findOne({ email: currentUserEmail });

        if (!user) {
            return res.status(404).json({ message: "Current user not found." });
        }
        user.friendRequests = user.friendRequests.filter(request => request.email !== userEmail);
        await user.save();
        return res.status(200).json({ message: "Friend request deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error while deleting friend request." });
    }
}