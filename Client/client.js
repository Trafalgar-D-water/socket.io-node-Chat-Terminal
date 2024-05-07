const io = require("socket.io-client");
const socket = io("http://localhost:3000");

const readline = require("readline");

let nickname = null;

console.log("connecting to the server...");

socket.on("connect" , ()=>{
    nickname = process.argv[2];
    console.log("[INFO] : Welcome %s" , nickname);
    socket.emit("join" , {"sender": nickname , "action": "join"}); 
});

socket.on("disconnect" , (reason)=>{
    console.log("[INFO]: Client disconnected, reason: %s", reason);
});


socket.on("broadcast" , (data)=>{
    console.log("%s" ,  data.msg)
;})


socket.on("join" , (data)=>{
    console.log("[INFO] : %s joined the chat" , data.sender);
})

socket.on("list" ,(data)=>{
    console.log("[INFO] :List of nickName:");
    for(let i = 0 ; i< data.users.length; i++){
        console.log(data.users[i])
    }
})

socket.on("quit" , (data)=>{
    console.log("[INFO]: %s quit the chat", data.sender);
})

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});

rl.on("line" ,  (input)=>{
    if(true === input.startsWith("b;")){
        let str = input.slice(2);
        socket.emit("broadcast" , {"sender":nickname , "action":"broadcast" , "msg":str});
    }
    else if("ls;" === input){
        socket.emit("list" , {"sender":nickname , "action":"list"})
    }
    else if("q;" === input){
        socket.emit("quit" , {"sender":nickname , "action":"quit"})
    }
})



