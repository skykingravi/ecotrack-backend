import express from "express";
import { WaterPollutionFormModel } from "../models/WaterPollutionForm.js";
import { AirPollutionFormModel } from "../models/AirPollutionForm.js";
import { ClimatePatternsFormModel } from "../models/ClimatePatternsForm.js";
import { DeforestationRateFormModel } from "../models/DeforestationRateForm.js";
import axios from "axios";

const router = express.Router();

// WATER POLLUTION FORM
router.get("/waterPollutionForm/:email", async (req, res) => {
    const { email } = req.params;
    const user = await WaterPollutionFormModel.findOne({
        email: email,
    });
    if (user) {
        // Email is already stored in the database
        res.json({ message: "Use another email please." });
    } else {
        // Email is not stored in the database
        res.json({ message: "You can proceed further!" });
    }
});

router.post("/waterPollutionForm", async (req, res) => {
    const { email, location, optionsArray } = req.body;

    const user = await WaterPollutionFormModel.findOne({
        email: email,
    });
    if (user) {
        return res.json({
            message: "User already exists! Use another email please.",
        });
    }

    const data = new WaterPollutionFormModel({
        email: email,
        location: location,
        optionsArray: optionsArray,
    });
    try {
        await data.save();
        res.json({
            message: "Thanks for the Data!",
        });
    } catch (error) {
        res.json(error);
    }
});

// AIR POLLUTION FORM
router.get("/airPollutionForm/:email", async (req, res) => {
    const { email } = req.params;
    const user = await AirPollutionFormModel.findOne({
        email: email,
    });
    if (user) {
        // Email is already stored in the database
        res.json({ message: "Use another email please." });
    } else {
        // Email is not stored in the database
        res.json({ message: "You can proceed further!" });
    }
});

router.post("/airPollutionForm", async (req, res) => {
    const { email, location, optionsArray } = req.body;

    const user = await AirPollutionFormModel.findOne({
        email: email,
    });
    if (user) {
        return res.json({
            message: "User already exists! Use another email please.",
        });
    }

    const data = new AirPollutionFormModel({
        email: email,
        location: location,
        optionsArray: optionsArray,
    });
    try {
        await data.save();
        res.json({
            message: "Thanks for the Data!",
        });
    } catch (error) {
        res.json(error);
    }
});

// CLIMATE PATTERNS FORM
router.get("/climatePatternsForm/:email", async (req, res) => {
    const { email } = req.params;
    const user = await ClimatePatternsFormModel.findOne({
        email: email,
    });
    if (user) {
        // Email is already stored in the database
        res.json({ message: "Use another email please." });
    } else {
        // Email is not stored in the database
        res.json({ message: "You can proceed further!" });
    }
});

router.post("/climatePatternsForm", async (req, res) => {
    const { email, location, optionsArray } = req.body;

    const user = await ClimatePatternsFormModel.findOne({
        email: email,
    });
    if (user) {
        return res.json({
            message: "User already exists! Use another email please.",
        });
    }

    const data = new ClimatePatternsFormModel({
        email: email,
        location: location,
        optionsArray: optionsArray,
    });
    try {
        await data.save();
        res.json({
            message: "Thanks for the Data!",
        });
    } catch (error) {
        res.json(error);
    }
});

// DEFORESTATION RATE FORM
router.get("/deforestationRateForm/:email", async (req, res) => {
    const { email } = req.params;
    const user = await DeforestationRateFormModel.findOne({
        email: email,
    });
    if (user) {
        // Email is already stored in the database
        res.json({ message: "Use another email please." });
    } else {
        // Email is not stored in the database
        res.json({ message: "You can proceed further!" });
    }
});

router.post("/deforestationRateForm", async (req, res) => {
    const { email, location, optionsArray } = req.body;

    const user = await DeforestationRateFormModel.findOne({
        email: email,
    });
    if (user) {
        return res.json({
            message: "User already exists! Use another email please.",
        });
    }

    const data = new DeforestationRateFormModel({
        email: email,
        location: location,
        optionsArray: optionsArray,
    });
    try {
        await data.save();
        res.json({
            message: "Thanks for the Data!",
        });
    } catch (error) {
        res.json(error);
    }
});

const getRating = (optionsArray) => {
    let points = 0;
    optionsArray.forEach((value) => points+=value);
    const rating = points/(optionsArray.length * 3);
    if (rating >= 0 && rating < 0.2) {
        return {
            color: "green",
            text: "NO OR MINOR DANGER",
            level: 1
        }
    }
    else if (rating >= 0.2 && rating < 0.4) {
        return {
            color: "yellow",
            text: "MODERATE DANGER",
            level: 2
        }
    }
    else if (rating >= 0.4 && rating < 0.6) {
        return {
            color: "orange",
            text: "CONSIDERABLE DANGER",
            level: 3
        }
    }
    else if (rating >= 0.6 && rating < 0.8) {
        return {
            color: "red",
            text: "HIGH DANGER",
            level: 4
        }
    }
    else {
        return {
            color: "dark-red",
            text: "VERY HIGH DANGER",
            level: 5
        }
    }
}

// Data Process & Analysis
router.get("/waterPollutionForm/data/:secret", async (req, res) => {
    const { secret } = req.params;
    if (secret !== process.env.SECRET) {
        res.json({ message: "You are not Authorized!" });
    } else {
        const data = await WaterPollutionFormModel.find();
        const promises = data.map(async (value) => {
            const rating = getRating(value.optionsArray);
            const cityDetails = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${value.location[1]}&lon=${value.location[0]}&appid=${process.env.API_KEY}`
            );
            const obj = {
                key: value._id,
                user: value.email,
                longitude: cityDetails.data.coord.lon,
                latitude: cityDetails.data.coord.lat,
                city: cityDetails.data.name,
                country: cityDetails.data.sys.country,
                color: rating.color,
                text: rating.text,
                level: rating.level,
            };
            return obj;
        });

        Promise.all(promises)
            .then((results) => {
                res.json(results);
            })
            .catch((error) => {
                console.error(error);
                res.json([]);
            });
    }
});
router.get("/airPollutionForm/data/:secret", async (req, res) => {
    const { secret } = req.params;
    if (secret !== process.env.SECRET) {
        res.json({ message: "You are not Authorized!" });
    } else {
        const data = await AirPollutionFormModel.find();
        const promises = data.map(async (value) => {
            const rating = getRating(value.optionsArray);
            const cityDetails = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${value.location[1]}&lon=${value.location[0]}&appid=${process.env.API_KEY}`
            );
            const obj = {
                key: value._id,
                user: value.email,
                longitude: cityDetails.data.coord.lon,
                latitude: cityDetails.data.coord.lat,
                city: cityDetails.data.name,
                country: cityDetails.data.sys.country,
                color: rating.color,
                text: rating.text,
                level: rating.level,
            };
            return obj;
        });

        Promise.all(promises)
            .then((results) => {
                res.json(results);
            })
            .catch((error) => {
                console.error(error);
                res.json([]);
            });
    }
});
router.get("/climatePatternsForm/data/:secret", async (req, res) => {
    const { secret } = req.params;
    if (secret !== process.env.SECRET) {
        res.json({ message: "You are not Authorized!" });
    } else {
        const data = await ClimatePatternsFormModel.find();
        const promises = data.map(async (value) => {
            const rating = getRating(value.optionsArray);
            const cityDetails = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${value.location[1]}&lon=${value.location[0]}&appid=${process.env.API_KEY}`
            );
            const obj = {
                key: value._id,
                user: value.email,
                longitude: cityDetails.data.coord.lon,
                latitude: cityDetails.data.coord.lat,
                city: cityDetails.data.name,
                country: cityDetails.data.sys.country,
                color: rating.color,
                text: rating.text,
                level: rating.level,
            };
            return obj;
        });

        Promise.all(promises)
            .then((results) => {
                res.json(results);
            })
            .catch((error) => {
                console.error(error);
                res.json([]);
            });
    }
});
router.get("/deforestationRateForm/data/:secret", async (req, res) => {
    const { secret } = req.params;
    if (secret !== process.env.SECRET) {
        res.json({ message: "You are not Authorized!" });
    } else {
        const data = await DeforestationRateFormModel.find();
        const promises = data.map(async (value) => {
            const rating = getRating(value.optionsArray);
            const cityDetails = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${value.location[1]}&lon=${value.location[0]}&appid=${process.env.API_KEY}`
            );
            const obj = {
                key: value._id,
                user: value.email,
                longitude: cityDetails.data.coord.lon,
                latitude: cityDetails.data.coord.lat,
                city: cityDetails.data.name,
                country: cityDetails.data.sys.country,
                color: rating.color,
                text: rating.text,
                level: rating.level,
            };
            return obj;
        });

        Promise.all(promises)
            .then((results) => {
                res.json(results);
            })
            .catch((error) => {
                console.error(error);
                res.json([]);
            });
    }
});

export { router as DataRouter };
