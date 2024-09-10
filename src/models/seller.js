const { Schema, model, Types } = require("mongoose");

const sellerSchema = new Schema(
  {
    telegramId: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: null,
    },
    img: {
      type: String,
      default: null,
    },
    liked: {
      type: [
        {
          type: Types.ObjectId,
          ref: "announcement",
        },
      ],
      default: [],
    },
    subscriptions: {
      type: [
        {
          type: Types.ObjectId,
          ref: "seller",
        },
      ],
      default: [],
    },
    reviewed: {
      type: [Types.ObjectId],
      default: [],
    },
    lastOnline: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["seller"],
      default: "seller",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("seller", sellerSchema);
