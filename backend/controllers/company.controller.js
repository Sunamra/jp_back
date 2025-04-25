import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
	try {
		const { companyName } = req.body;
		if (!companyName) {
			return res.status(400).json({
				message: "Company name is required",
				success: false
			});
		}

		// let company = await Company.findOne({ name: companyName }); // Case Sensitive
		let company = await Company.findOne({ name: new RegExp("^" + String(companyName).trim() + "$", "i") }); // Matches string regardless of case

		if (company) {
			return res.status(400).json({
				message: "Company name is already taken",
				success: false
			})
		};
		company = await Company.create({
			name: companyName,
			userId: req.id,
			registeredFully: false
		});

		return res.status(200).json({
			message: "Company registered successfully",
			company,
			success: true
		})
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: error.response?.data?.message || error,
			success: false
		})
	}
}

export const getCompany = async (req, res) => {
	try {
		const userId = req.id; // logged in user id
		const companies = await Company.find({ userId });
		if (!companies) {
			return res.status(404).json({
				message: "Companies not found.",
				success: false
			})
		}

		return res.status(200).json({
			companies,
			success: true
		})
	} catch (error) {
		console.log(error);
	}
}

export const getCompanyById = async (req, res) => {
	try {
		const companyId = req.params.id;
		const company = await Company.findById(companyId);
		if (!company) {
			return res.status(404).json({
				message: "Company not found.",
				success: false
			})
		}
		return res.status(200).json({
			company,
			success: true
		})
	} catch (error) {
		console.log(error);
	}
}

export const updateCompany = async (req, res) => {
	try {
		const { name, description, website, location } = req.body;

		const file = req.files?.file1?.[0];

		// Only upload file when a new file is input
		const logoFilename = file ? file?.originalname : undefined;
		const fileUri = file ? getDataUri(file) : undefined;
		const cloudResponse = file ? await cloudinary.uploader.upload(fileUri.content) : undefined;
		const logo = file ? cloudResponse?.secure_url : undefined;

		// Handling registeredFully & success message
		let registeredFully;
		let successMsg = "";
		const companyById = await Company.findById(req.params?.id);

		if (companyById?.registeredFully === false) {
			registeredFully = true;
			successMsg = "Company registered successfully";
		}
		else {
			registeredFully = companyById?.registeredFully;
		}

		const updateData = file ?
			{ name, description, website, location, registeredFully, logo, logoFilename } :
			{ name, description, website, location, registeredFully };

		let companyExists = await Company.findOne({ name: new RegExp("^" + String(name).trim() + "$", "i") });
		if (companyExists && companyExists._id != req?.params?.id) {
			return res.status(400).json({
				message: "Company name is already taken",
				success: false
			})
		};

		const company = await Company.findByIdAndUpdate(req.params?.id, updateData, { new: true });


		if (!company) {
			return res.status(404).json({
				message: "Company not found.",
				success: false
			})
		}
		return res.status(200).json({
			message: successMsg || "Company information updated",
			success: true
		})

	} catch (error) {
		console.error(error);
		return res.status(400).json({
			message: error.message || "Error occurred while updating details",
			success: false
		});
	}
}

// Functions for Super-Admin
export const getSuperAdminCompanies = async (req, res) => {
	try {
		const companies = await Company.find().populate('userId'); // Fetch all companies

		if (!companies.length) {
			return res.status(404).json({
				message: "No companies found.",
				success: false
			});
		}

		return res.status(200).json({
			companies,
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

export const deleteSuperAdminCompanies = async (req, res) => {
	try {
		const companyId = req.params.id;


		const allJobs = await Job.find().populate('company');

		const jobIds = allJobs
			.filter(job => job.company._id == companyId)
			.map(job => job._id);

		// Delete jobs by their IDs before deleting company
		if (jobIds.length > 0) {
			await Job.deleteMany({ _id: { $in: jobIds } });
		}

		// Find the company by ID
		const company = await Company.findByIdAndDelete(companyId);

		if (!company) {
			return res.status(404).json({
				message: "Company not found",
				success: false
			});
		}

		const remainingCompanies = await Company.find().populate('userId');

		const deletedCompName = company.name ? company.name + " " : "";

		return res.status(200).json({
			message: `Company ${deletedCompName}deleted successfully`,
			companies: remainingCompanies,
			success: true
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Server error",
			success: false
		});
	}
};
