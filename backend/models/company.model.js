import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    logo: {
        type: String // Cloudinary URL to company logo
    },
    logoFilename: {
        type: String, // Store the original filename of company logo
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registeredFully: {   // New field added
        type: Boolean,
        required: true
    }
}, { timestamps: true })
export const Company = mongoose.model("Company", companySchema);