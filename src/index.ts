import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { blockUser, getUsers, newUser } from "../helpers/users";
import { getMessages, newMessage } from "../helpers/message";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app: Express = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("connected", socket.id);
  // const user = await newUser(socket.handshake.query.user);

  socket.on("join", async (data) => {
    await newUser({ ...data, id: socket.id });
    const users = await getUsers();
    console.log(users);
    socket.broadcast.emit("users", users);
    socket.emit("users", users);
  });

  socket.on("out", async (data) => {
    console.log("disconnected", socket.handshake.query.user);
    const users = await getUsers();
    io.emit("users", users);
  });

  socket.on("message", async (data) => {
    console.log("message", data);
    await newMessage(data);
    const messages = await getMessages(
      [data.from.sub, data.to.sub].sort().join("")
    );
    console.log("New Message Trigger", messages);
    socket.broadcast.emit("messages", messages);
    socket.emit("messages", messages);
  });

  socket.on("block", async (data) => {
    console.log("block", data);
    await blockUser(data.to.sub, data.from.sub);
    const users = await getUsers(data.from.sub);
    console.log("Block User Trigger", users);
    socket.broadcast.emit("users", users);
    socket.emit("users", users);
  });

  socket.on("messages", async (data) => {
    const messages = await getMessages(data.chatId);
    console.log("messages", messages, data.chatId);
    socket.emit("messages", messages);
  });

  //closed connectoion
  socket.on("disconnect", async (soc) => {
    console.log("disconnected", socket.id);
    const users = await getUsers(socket.id);
    io.emit("users", users);
  });
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello World",
  });
});

httpServer.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
