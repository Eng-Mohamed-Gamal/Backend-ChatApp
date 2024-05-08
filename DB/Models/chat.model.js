import { Schema, Types, model } from "mongoose";

const chatSchema = new Schema(
  {
    chatName: { type: String, required: true },
    users: [
      {
        type: Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    latestMessage: { type: Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);

export default Chat;
