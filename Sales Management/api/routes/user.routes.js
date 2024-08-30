import express from 'express'
import { test, updateUser,deleteUser,updateItem,deleteItem,getItem, deleteDiscount, getDiscount, updateDiscount } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router=express.Router();

router.get('/',test)
router.post("/update/:id",verifyToken,updateUser)
router.delete("/delete/:id",verifyToken,deleteUser)


//items
router.delete("/deleteitem/:id",deleteItem)
router.get('/getitem/:id', getItem);//for update fetch data
router.put("/updateitem",updateItem)



//discounts
router.delete("/deletediscount/:id",deleteDiscount)
router.get('/getdiscount/:id', getDiscount);//for update fetch data
router.put("/updatediscount",updateDiscount)





export default router