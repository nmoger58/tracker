const express=require('express');
const app=express();
const http=require('http');
const socket=require('socket.io')
const server=http.createServer(app);
const path=require('path')
const io=socket(server)
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"public")))

io.on('connection',(socket)=>{
    console.log("connected")
    socket.on('send-location',(data)=>{
     io.emit('recieve-location',{id : socket.id,...data})
    })
    socket.on('disconnect',()=>{
        io.emit('user-disconnected',socket.id);
    })
})
app.get('/',(req,res)=>{
  res.render("index")
})

server.listen(3000)