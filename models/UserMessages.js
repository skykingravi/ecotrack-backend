import mongoose from "mongoose";

const UserMessagesSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    messages: [{
        type: String,
    }]
});

export const UserMessagesModel = new mongoose.model("user-messages", UserMessagesSchema);