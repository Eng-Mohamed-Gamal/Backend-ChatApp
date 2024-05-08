import Chat from "../../../DB/Models/chat.model.js";
import User from "../../../DB/Models/user.model.js";

export const addOrFetchChat = async (req, res, next) => {
  const { _id: loggedUser } = req.authUser;
  const { userId } = req.query;

  // find Chat
  let isChat = await Chat.findOne({
    $and: [
      { users: { $elemMatch: { $eq: loggedUser } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "userName profilePic email",
    strictPopulate: false,
  });
  if (!isChat) {
    const Data = {
      chatName: "sender",
      users: [loggedUser, userId],
    };

    const createdChat = await Chat.create(Data);
    if (!createdChat) return next({ message: "Create Fail" });
    const chatDetails = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    return res.status(201).json({ message: "Create Chat Done", chatDetails });
  }

  return res.status(200).json({ message: "Chat Fetched Done", isChat });
};

export const getAllChats = async (req, res, next) => {
  const { _id: loggedId } = req.authUser;

  // Get All Chats For Specfic User Sorted DESC
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: loggedId } },
  })
    .populate("users", "-password")
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({ createdAt: -1 });

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "userName profilePic email",
  });

  res.status(200).json({ message: "Chat Fetched Done", chats });
};
