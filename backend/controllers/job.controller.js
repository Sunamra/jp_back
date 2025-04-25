import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Please fill out all the fields",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            experienceLevel,
            location,
            jobType,
            position,
        } = req.body;

        // Create an object with only the fields that are allowed to be updated
        const updateData = {
            title,
            description,
            requirements,
            salary,
            experienceLevel,
            location,
            jobType,
            position,
        };

        // Remove undefined fields to avoid overwriting with undefined
        Object.keys(updateData).forEach(
            (key) => updateData[key] === undefined && delete updateData[key]
        );

        // Update the job by its ID
        const job = await Job.findByIdAndUpdate(req.params.id, updateData, {
            new: true, // Return the updated document
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Job information updated",
            success: true,
            job,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while updating the job",
            success: false,
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate([
            { path: "applications" },
            { path: "company" }
        ]);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Super-Admin functions
export const deleteJobById = async (req, res) => {
    try {
        const jobId = req.params.id;


        console.log("I came from company controller", jobId);
        return

        // Find the job by ID and delete it
        const job = await Job.findByIdAndDelete(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        const restJobs = await Job.find().populate('company');

        const deletedJobTitle = job.title ? job.title + " " : "";

        return res.status(200).json({
            message: `Job ${deletedJobTitle}deleted successfully`,
            jobs: restJobs,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while deleting the job",
            success: false,
        });
    }
};
