import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Items: [
    {
      ProductId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      Quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      priceAtTime: {
        type: Number,
        required: true,
      },
    },
  ],
} , {timestamps : true});

export const Cart = mongoose.model("Cart" , cartSchema    )
