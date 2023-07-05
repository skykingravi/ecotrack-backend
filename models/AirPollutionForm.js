import mongoose from "mongoose";
import { FormSchema } from "../template/FormSchema.js";

export const AirPollutionFormModel = new mongoose.model("air-pollution-form-datas", FormSchema);
