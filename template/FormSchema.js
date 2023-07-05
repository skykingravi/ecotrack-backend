import mongoose from "mongoose";

export const FormSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    location: [{
        type: Number,
        required: true
    }],
    // 0 -> LONGITUDE & 1 -> LATITUDE
    optionsArray: [{
        type: Number,
        required: true
    }]
});