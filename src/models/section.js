const { Schema, model, Types } = require("mongoose");

const sectionSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    categories: {
      type: [
        {
          // _id: {
          //   type: Types.ObjectId,
          // },
          name: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("section", sectionSchema);
