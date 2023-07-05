import mongoose from "mongoose";
import { FormSchema } from "../template/FormSchema.js";

export const DeforestationRateFormModel = new mongoose.model("deforestation-rate-form-datas", FormSchema);
