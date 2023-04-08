const connectDB = require("./mongodbConnection");
const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: { type: Date, default: Date.now },
  }
);

const chatDetails = mongoose.model("chatData", chatSchema);

module.exports = chatDetails;
