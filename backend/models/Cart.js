const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    items: [{
        itemId: {
            type: String, 
            required: true,
        },
        itemName: {
            type: String, 
            required: true,
        },
        itemPrice: {
            type: Number, 
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
