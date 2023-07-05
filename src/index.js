import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { DataRouter } from '../routes/forms.js';
import { MessagesRouter } from '../routes/messages.js';

const app = express();

app.use(express.json());
dotenv.config();
app.use(cors());
app.use('/forms' , DataRouter);
app.use('/message' , MessagesRouter);

const PORT = process.env.PORT;
const STRING_URL = process.env.LEFT_URL + process.env.PASSWORD + process.env.RIGHT_URL;

mongoose.connect(STRING_URL).then(() => console.log("DB Connected !")).catch((err) => console.error(err));

app.listen(PORT, () => {
    console.log(`SERVER STARTED AT PORT - ${PORT}`);
})