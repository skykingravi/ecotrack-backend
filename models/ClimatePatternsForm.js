import mongoose from "mongoose";
import { FormSchema } from "../template/FormSchema.js";

export const ClimatePatternsFormModel = new mongoose.model("climate-patterns-form-datas", FormSchema);
