import express from "express";
import { UserMessagesModel } from "../models/UserMessages.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, message } = req.body;
    const user = await UserMessagesModel.findOne({
        email: email
    });

    if (user) {
        user.messages.push(req.body.message);
        await user.save();
        res.json({message: "Message Received!"});
    }
    else {
        try {
            const newMessage = new UserMessagesModel({
                email: email,
                messages: [message]
            });
            await newMessage.save();
            res.json({message: "Message Received!"});
        } catch (error) {
            console.error(error);
        }
    }
});

export { router as MessagesRouter };