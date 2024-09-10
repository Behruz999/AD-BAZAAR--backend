const { Schema, model, Types } = require("mongoose");

const announcementSchema = new Schema(
  {
    title: {
      type: String,
      index: true,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    seller: {
      type: Types.ObjectId,
      ref: "seller",
      required: true,
    },
    section: {
      type: Types.ObjectId,
      ref: "section",
      required: true,
    },
    category: {
      type: {
        _id: {
          type: Types.ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    currency: {
      type: String,
      default: "USD",
    },
    price: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      // 0 - none, 1 - discount, 2 - TOP
      enum: [0, 1, 2],
      default: 0,
    },
    status: {
      type: Number,
      // 0 - unavailable, 1 - available
      enum: [0, 1],
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("announcement", announcementSchema);
