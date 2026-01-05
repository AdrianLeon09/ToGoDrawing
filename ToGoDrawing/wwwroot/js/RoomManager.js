const StrokeMap = new Map();

// --- SignalR Connection ---
 window.connection = new signalR.HubConnectionBuilder()
    .withUrl("/SendStrokesServer")
    .withAutomaticReconnect()
    .build();

async function startSignalR() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.error("SignalR Connection Error:", err);
        setTimeout(startSignalR, 5000);
    }
}
startSignalR();

connection.on("ReceiveStrokes", (name, strokes) => {
    console.log("Received strokes:", name, strokes);
    StrokeMap.set(name, strokes);
    window.DrawMapStrokes();
});
connection.onclose(async () => {
    await startSignalR();
});

window.DrawMapStrokes = function () {
    clearCanvas();
   for(let [key, value] of StrokeMap){
    console.log(key);
    window.renderDrawing(value);
   }
    window.renderDrawing(state.internalStrokes);
   
};

window.createRoom = async function () {
 const id = await connection.invoke("CreateRoom");
 console.log("Room created: ", id);
 state.roomId = id;
 return id;
}

window.joinRoom = async function (roomId) {
    await connection.invoke("JoinRoom", roomId);
    state.roomId = roomId;
}

window.sendRoomId  = async function() {
    console.log("Sending room id", state.roomId);
    return state.roomId;
}
