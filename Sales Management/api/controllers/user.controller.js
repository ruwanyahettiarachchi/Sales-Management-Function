import User from "../models/user.model.js"
import Item from "../models/item.model.js"
import Discount from "../models/discount.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';

export const test=(req,res)=>{
    res.json({
        message:'API is working'
    })
}

export const updateUser=async (req,res,next)=>{
    if(req.user.id!==req.params.id){
        return next(errorHandler(401,'you can update only your account!'))

    }
    try{
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }

        const updateUser=await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    pasword:req.body.password,
                    profilePicture:req.body.profilePicture,
                },
            },
            {new:true}
        );
        const {password, ...rest}=updateUser._doc;
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

export const deleteUser=async(req,res,next)=>{
    if(req.user.id !==req.params.id){
        return next(errorHandler(401,'you can delete only ypur account'));

    }try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user has been deleted....')
    }catch(error){
        next(error)

    }
}

export const test1 = (req, res) => {
    res.json({
        message: 'API is working'
    });
}






//Item

export const updateItem =async(req,res)=>{
    const {id,...rest}=req.body
    const data=await Item.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
}

export const deleteItem = async (req, res, next) => {
    let petId=req.params.id;
    console.log(petId)
    try {
        await Item.findByIdAndDelete(petId);
        res.status(200).json('The item has been deleted');
    } catch (error) {
        next(error);
    }
}


export const getItem= async (req, res) => {
    const id = req.params.id;

    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).send({ success: false, message: "Item not found" });
        }

        res.send({ success: true, message: "Item fetched successfully", data: item });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};







//Discount

export const updateDiscount =async(req,res)=>{
    const {id,...rest}=req.body
    const data=await Discount.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
}

export const deleteDiscount = async (req, res, next) => {
    let discountId=req.params.id;
    console.log(discountId)
    try {
        await Discount.findByIdAndDelete(discountId);
        res.status(200).json('The discount has been removed');
    } catch (error) {
        next(error);
    }
}


export const getDiscount= async (req, res) => {
    const id = req.params.id;

    try {
        const discount = await Discount.findById(id);

        if (!discount) {
            return res.status(404).send({ success: false, message: "Item not found" });
        }

        res.send({ success: true, message: "discount fetched successfully", data: discount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};

