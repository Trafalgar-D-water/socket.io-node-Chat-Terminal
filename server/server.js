const port = 3000;

// const io = require('socket.io')(port); 
const http = require('http')

const socketIo = require('socket.io');

const server = http.createServer();

const io = socketIo(server);



// console.log("Server is listening on port: %d", port);

io.of("/").on('connect' , (socket)=>{
    console.log("\nA client connected");

    socket.on("disconnect" , (reason) =>{
        console.log('\nA client disconnected , reason: %s' , reason);
        console.log("number of cleints :%d" , io.sockets.clientsCount());
    })

    socket.on("broadcast", (data)=>{
        console.log( "\n%s", data);
        socket.broadcast.emit("broadcast", data);
        
    })

    socket.on("join" , (data)=>{
        console.log("\n%s" , data);
        console.log("Nickname: " + data.sender ,", ID: ", socket.id);
        console.log("Number of clients: %d", io.of('/').server.engine.clientsCount);
        socket.nickname = data.sender;
        socket.broadcast.emit("join", data);
    })

    socket.on("list" , (data)=>{
        console.log("\n%s" , data);
         var users= [];

         for(const [key , value] of io.of("/").sockets){
            users.push(value.nickname);
         }

         socket.emit("list" , {"sender": data.sender, "action": "list", "users": users} );
    })

    socket.on("quit" , (data)=>{
        console.log("\n%s", data);
        socket.broadcast.emit("quit", data);
        socket.disconnect(true);
    })

})

server.listen(port, ()=>{
    console.log("Server is listening on port: %d", port);
})