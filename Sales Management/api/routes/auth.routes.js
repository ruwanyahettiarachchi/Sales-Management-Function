import express from 'express'
import { signin, signup,google,signout,itemadd,getOrdersByCustomerId,allitems,google1, alldiscounts, getDiscountsByCustomerId, discountadd } from '../controllers/auth.controller.js';


const router=express.Router();

router.post("/signup",signup)//register
router.post("/signin",signin)//login
router.post("/google",google)
router.post("/google1",google1)
router.get('/signout',signout)

//items
router.post("/itemadd",itemadd)
router.get("/user/:id",getOrdersByCustomerId)//for data fetch user id
router.get("/managers/items",allitems)

//discount
router.post("/discountadd",discountadd)
router.get("/user/:id",getDiscountsByCustomerId)//for data fetch user id
router.get("/managers/items",alldiscounts)


export default router