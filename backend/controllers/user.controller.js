import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// User SignUp
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Please fill out all fields",
                success: false
            });
        };
        const file = req?.files?.file1?.[0];

        if (!file) {
            throw new Error("Please upload a Profile Picture");
        }

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                avatar: cloudResponse.secure_url,
                avatarOriginalName: file.originalname
            }
        });

        return res.status(200).json({
            message: "Account Created Successfully",
            success: true
        });
    } catch (error) {
        // console.log(error);
        return res.status(error.http_code ? error.http_code : 400).json({
            message: error.message,
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Please fill out all fields",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Account doesn't exist with current Email",
                success: false,
            })
        }

        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }

        // console.log("JWT Secret Key:", process.env.SECRET_KEY);

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            bookmarkedJobs: user.bookmarkedJobs
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged Out Successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { skills, fullname, bio, phoneNumber, oldPassword, newPassword } = req.body;

        const resumeFile = req?.files.file1?.[0];
        const avatarFile = req?.files.file2?.[0];

        const resumeFileUri = resumeFile ? getDataUri(resumeFile) : undefined;
        const resumeCloudResponse = resumeFileUri ? await cloudinary.uploader.upload(resumeFileUri.content) : undefined;

        const avatarFileUri = avatarFile ? getDataUri(avatarFile) : undefined;
        const avatarCloudResponse = avatarFileUri ? await cloudinary.uploader.upload(avatarFileUri.content) : undefined;

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        // Password Updating Process
        if ((oldPassword && !newPassword) || (newPassword && !oldPassword)) {
            return res.status(400).json({
                message: "Please input both passwords",
                success: false
            });
        }
        else if (oldPassword && newPassword && oldPassword == newPassword) {
            return res.status(400).json({
                message: "Old & New passwords can't be same",
                success: false
            });
        }

        if (oldPassword) {
            const passwordMatched = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatched) {
                return res.status(400).json({
                    message: "Incorrect old password",
                    success: false,
                })
            };
        }

        const hashedNewPassword = newPassword ? await bcrypt.hash(newPassword, 10) : undefined;

        // updating data
        if (fullname) user.fullname = fullname
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray
        if (hashedNewPassword) user.password = hashedNewPassword

        if (resumeCloudResponse) {
            user.profile.resume = resumeCloudResponse.secure_url
            user.profile.resumeOriginalName = resumeFile.originalname
        }
        if (avatarCloudResponse) {
            user.profile.avatar = avatarCloudResponse.secure_url
            user.profile.avatarOriginalName = avatarFile.originalname
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            bookmarkedJobs: user.bookmarkedJobs
        }

        const updateMessage = ((oldPassword && newPassword) && (!skills && !fullname && !bio && !phoneNumber)) ?
            "Password Updated Successfully" :
            "Profile Updated Successfully";

        return res.status(200).json({
            message: updateMessage,
            user,
            success: true
        });
    } catch (error) {
        // console.log(error);
        return res.status(error.http_code ? error.http_code : 400).json({
            message: error.message || "Updating Error",
            success: false
        });
    }
}

export const bookmarkJob = async (req, res) => {
    const { jobId } = req.body;
    const userId = req.id;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({
            message: 'User not found',
            success: false
        });

        let resMessage = "";

        // Check if job is already bookmarked
        if (user.bookmarkedJobs.includes(jobId)) {
            let index = user.bookmarkedJobs.indexOf(jobId);
            if (index !== -1) {
                user.bookmarkedJobs.splice(index, 1); // Removing job from bookmark
            }
            resMessage = "Job removed from Bookmark";
        }
        else {
            user.bookmarkedJobs.push(jobId); // Adding job to bookmark
            resMessage = "Job Bookmarked Successfully";
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            bookmarkedJobs: user.bookmarkedJobs,
        }

        res.status(200).json({
            message: resMessage,
            user,
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Bookmark Error',
            success: false
        });
    }
};

// Functions for Super-Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users.length) {
            return res.status(404).json({
                message: "No users found.",
                success: false
            });
        }

        return res.status(200).json({
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID and delete it
        const user = await User.findByIdAndDelete(userId);

        const deletedUserName = user.fullname ? user.fullname + " " : "";

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Get the remaining users
        const remainingUsers = await User.find();

        return res.status(200).json({
            message: `User ${deletedUserName}deleted successfully`,
            users: remainingUsers,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while deleting the user",
            success: false,
        });
    }
};

