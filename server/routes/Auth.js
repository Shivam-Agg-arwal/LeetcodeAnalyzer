import express from 'express';
const router=express.Router();

import {sendOTP,login,signIn} from '../controllers/Auth.js'

import {resetPassword,resetPasswordToken} from '../controllers/Reset.js'

router.post("/sendOtp",sendOTP);
router.post("/login",login);
router.post("/signin",signIn);
router.post("/resetPassword",resetPassword);
router.post("/resetPasswordToken",resetPasswordToken);

export default router;