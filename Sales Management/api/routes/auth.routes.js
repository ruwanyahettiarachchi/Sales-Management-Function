import express from 'express'
import { signin, signup,google,signout,itemadd,allitems,google1, alldiscounts, discountadd } from '../controllers/auth.controller.js';
import { test, updateUser,deleteUser,updateItem,deleteItem,getItem } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router=express.Router();

router.post("/signup",signup)//register
router.post("/signin",signin)//login
router.post("/google",google)
router.post("/google1",google1)
router.get('/signout',signout)

//items
router.post("/itemadd",itemadd)

router.get("/allitems",allitems)

//discount
router.post("/discountadd",discountadd)
//for data fetch user id
router.get("/managers/discounts",alldiscounts)


export default router