import Chat from "../../../DB/Models/chat.model.js";
import Message from "../../../DB/Models/message.model.js";
import User from "../../../DB/Models/user.model.js";


export const addMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  const { _id: loggedId } = req.authUser;

  // create Message
  const message = await Message.create({
    content,
    chat: chatId,
    sender: loggedId,
  });

  // get message details
  let detailsMessage = await Message.findById(message._id)
    .populate("sender")
    .populate("chat");
  detailsMessage = await User.populate(detailsMessage, {
    path: "chat.users",
    select: "userName  profilePic email",
    strictPopulate: false,
  });
  // set value to latestMessage In Chat
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { latestMessage: detailsMessage },
    { new: true }
  );

  if (!chat) {
    // delete message document
    await Message.findByIdAndDelete(message._id);
  }

 

  return res
    .status(201)
    .json({ message: "Message Added Successfully", detailsMessage });
};

export const getAllMessages = async (req, res, next) => {
  const { chatId } = req.body;
  const messages = await Message.find({ chat: chatId })
    .populate("sender", "userName profilePic email")
    .populate("chat");
  return res.status(200).json({ message: "Messages Fetched Done", messages });
};
