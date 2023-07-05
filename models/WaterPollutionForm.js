import mongoose from "mongoose";
import { FormSchema } from "../template/FormSchema.js";

export const WaterPollutionFormModel = new mongoose.model("water-pollution-form-datas", FormSchema);
