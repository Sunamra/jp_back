import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany, getSuperAdminCompanies,deleteSuperAdminCompanies } from "../controllers/company.controller.js";
import { multiUpload, singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, multiUpload, updateCompany);

// Super-Admin Routes
router.route("/superadmin/get").get(isAuthenticated, getSuperAdminCompanies);
router.delete("/superadmin/companies/:id", isAuthenticated, deleteSuperAdminCompanies);

export default router;

