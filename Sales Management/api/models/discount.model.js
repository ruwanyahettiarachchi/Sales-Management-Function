import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    discountId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    itemCategory: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: String,
        required: true,
        trim: true
    },
    promoCode: {
        type: String,
        required: true,
        trim: true
    },
    
}, { timestamps: true });

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
