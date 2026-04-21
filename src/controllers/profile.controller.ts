import Profile from "../models/profile.model.js";
import type { Request, Response } from "express";

const getProfiles = async (req: Request, res: Response) => {
    try {
        const {
            gender,
            age_group,
            country_id,
            min_age,
            max_age,
            min_gender_probability,
            min_country_probability,
        } = req.query;

        const filter: {
            gender?: "male" | "female";
            age_group?: "child" | "teenager" | "adult" | "senior";
            country_id?: string;
            age?: { $gte?: number; $lte?: number };
            gender_probability?: { $gte: number };
            country_probability?: { $gte: number };
        } = {};

        if (gender !== undefined) {
            if (typeof gender !== "string" || !["male", "female"].includes(gender)) {
                return res.status(422).json({ status: "error", message: "Invalid query parameters" });
            }
            filter.gender = gender as "male" | "female";
        }

        if (age_group !== undefined) {
            if (
                typeof age_group !== "string" ||
                !["child", "teenager", "adult", "senior"].includes(age_group)
            ) {
                return res.status(422).json({ status: "error", message: "Invalid query parameters" });
            }
            filter.age_group = age_group as "child" | "teenager" | "adult" | "senior";
        }

        if (country_id !== undefined) {
            if (typeof country_id !== "string" || !/^[a-zA-Z]{2}$/.test(country_id)) {
                return res.status(422).json({ status: "error", message: "Invalid query parameters" });
            }
            filter.country_id = country_id.toUpperCase();
        }

        if (min_age !== undefined || max_age !== undefined) {
            filter.age = {};

            if (min_age !== undefined) {
                const minAgeNumber = Number(min_age);
                if (!Number.isFinite(minAgeNumber)) {
                    return res.status(422).json({ status: "error", message: "Invalid query parameters" });
                }
                filter.age.$gte = minAgeNumber;
            }

            if (max_age !== undefined) {
                const maxAgeNumber = Number(max_age);
                if (!Number.isFinite(maxAgeNumber)) {
                    return res.status(422).json({ status: "error", message: "Invalid query parameters" });
                }
                filter.age.$lte = maxAgeNumber;
            }

            if (
                filter.age.$gte !== undefined &&
                filter.age.$lte !== undefined &&
                filter.age.$gte > filter.age.$lte
            ) {
                return res.status(422).json({ status: "error", message: "Invalid query parameters" });
            }
        }

        if (min_gender_probability !== undefined) {
            const minGenderProbability = Number(min_gender_probability);
            if (!Number.isFinite(minGenderProbability)) {
                return res.status(422).json({ status: "error", message: "Invalid query parameters" });
            }
            filter.gender_probability = { $gte: minGenderProbability };
        }

        if (min_country_probability !== undefined) {
            const minCountryProbability = Number(min_country_probability);
            if (!Number.isFinite(minCountryProbability)) {
                return res.status(422).json({ status: "error", message: "Invalid query parameters" });
            }
            filter.country_probability = { $gte: minCountryProbability };
        }

        const profiles = await Profile.find(filter);

        return res.status(200).json({
            status: "success",
            total: profiles.length,
            data: profiles,
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

export { getProfiles };