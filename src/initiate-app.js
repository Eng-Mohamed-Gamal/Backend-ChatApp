import connection from "../DB/connection.js";
import * as routers from "./index.routes.js";
import { globalResponse } from "./middleWares/global-response.middleware.js";
import cors from "cors";
import { generateIO } from "./utils/io-generation.js";

export const initiateApp = (app, express) => {
  const port = process.env.PORT;

  app.use(express.json());
  app.use(cors());
  connection();
  app.use("/user", routers.userRouter);
  app.use("/message", routers.messageRouter);
  app.use("/chat", routers.chatRouter);
  app.use("*", (req, res) => {
    return res.status(404).json({
      messsage: "Not Found",
    });
  });
  app.use(globalResponse);

  const server = app.listen(port, () =>
    console.log(`Server Start On Port ${port}`)
  );

  const io = generateIO(server);
  io.setMaxListeners(Infinity);
  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      socket.join(userData._id);
    });
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });
    socket.on("new Message", (newMessageRecieved) => {
      const chat = newMessageRecieved.chat;
      if (!chat.users) return console.log("chat.users not defined");
      chat.users.forEach((user) => {
        if (user._id !== newMessageRecieved.sender._id) {
          socket.to(user._id).emit("message recieved", newMessageRecieved);
        }
      });
    });
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
};
