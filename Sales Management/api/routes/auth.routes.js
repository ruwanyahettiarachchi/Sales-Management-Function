import express from 'express'
import { signin, signup,google,signout,itemadd,getOrdersByCustomerId,allitems,google1 } from '../controllers/auth.controller.js';


const router=express.Router();

router.post("/signup",signup)//register
router.post("/signin",signin)//login
router.post("/google",google)
router.post("/google1",google1)
router.get('/signout',signout)


router.post("/itemadd",itemadd)
router.get("/user/:id",getOrdersByCustomerId)//for data fetch user id
router.get("/managers/items",allitems)
export default router