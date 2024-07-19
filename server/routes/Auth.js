import express from 'express';
const router=express.Router();

import {sendOTP,login,signIn} from '../controllers/Auth.js'

router.post("/sendOtp",sendOTP);
router.post("/login",login);
router.post("/signin",signIn);

export default router;