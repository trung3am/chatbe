const express = require("express");
const app = express();
const socket = require("socket.io");
const color = require("colors");
const cors = require("cors");
const { get_Current_User, user_Disconnect, join_User, getRoomUsers } = require("./dummyuser");
app.use(express.json());

const port = process.env.PORT || 8000;



var server = app.listen(
  port,
  console.log(
    `Server is running on the port no: ${(port)} `
      .green
  )
);

const io = socket(server, {
  cors: {
    origin: "*",
     method: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});


io.on("connection", (socket) => {
  
  socket.on("joinRoom", ({ username, roomname, avaurl }) => {
    
    const p_user = join_User(socket.id, username, roomname, avaurl);
    if (p_user) {
      console.log(socket.id, "=id");
      socket.join(p_user.room);
  
      
      socket.emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `Welcome ${p_user.username}`,
        avaurl: p_user.avaurl
      });
      
      io.in(p_user.room).emit("roomusers", getRoomUsers(p_user.room))    
      
      socket.broadcast.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has joined the chat`,
        avaurl: p_user.avaurl
      });
    }
  });

  
  socket.on("chat", (text) => {
    
    const p_user = get_Current_User(socket.id);
    
    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
      avaurl: p_user.avaurl
    });
  });

  
  socket.on("disconnect", () => {
    
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the chat`,
      });
    }
  });
});