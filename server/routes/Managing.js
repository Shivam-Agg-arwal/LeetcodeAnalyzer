import express from 'express';
const router=express.Router();

import {AddLeetcodeId,RemoveLeetcodeId,fetchData} from '../controllers/Managing.js'
import {auth} from '../Authentication/auth.js'

router.post("/AddLeetcodeId",auth,AddLeetcodeId);
router.post("/RemoveLeetcodeId",auth,RemoveLeetcodeId);
router.post("/fetchData",auth,fetchData);

export default router;