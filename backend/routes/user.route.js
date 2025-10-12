import { handleUserSignUp, handleUserLogin } from "../controllers/user.controller.js";

import express from "express";
const router = express.Router();

//User Sign-Up Route
router.post('/signup', handleUserSignUp);

//User Login Route
router.post('/signin', handleUserLogin);

export default router;