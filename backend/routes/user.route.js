import express from "express";
import {
	login, logout, register, updateProfile,
	bookmarkJob, getAllUsers, deleteUser
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { multiUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(multiUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, multiUpload, updateProfile);
router.route('/bookmark').post(isAuthenticated, bookmarkJob);

// Super-Admin Routes
router.route('/get').get(isAuthenticated, getAllUsers);
router.route('/superadmin/deleteuser/:id').delete(isAuthenticated, deleteUser);

export default router;

