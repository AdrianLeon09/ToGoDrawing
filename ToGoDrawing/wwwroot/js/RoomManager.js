let StrokeMap = ""

// --- SignalR Connection ---
 window.connection = new signalR.HubConnectionBuilder()
    .withUrl("/SendStrokesServer")
    .withAutomaticReconnect()
    .build();

async function StartSignalR() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.error("SignalR Connection Error:", err);
        setTimeout(StartSignalR, 5000);
    }
}
StartSignalR();

connection.on("ReceiveStrokes", (user, strokesDictionary) => {
    console.log("Received strokes CONNECTION:", user, strokesDictionary);
    StrokeMap = strokesDictionary
    window.DrawMapStrokes();
});

connection.onclose(async () => {
    await StartSignalR();
});

window.DrawMapStrokes = function () {
    ClearCanvas();
   for(const[key, value] of Object.entries(StrokeMap)){
       
    window.RenderDrawing(value);
   }
    window.RenderDrawing(state.internalStrokes);
};

window.CreateRoom = async function () {
 const id = await connection.invoke("CreateRoom", state.username, state.internalStrokes);
 console.log("Room created: ", id);
 state.roomId = id;
 return id;
}

window.JoinRoom = async function (roomId) {
    await connection.invoke("JoinRoom", roomId);
    state.roomId = roomId;
   await RenewRoom();
}

window.SendRoomId  = async function() {
    console.log("Sending room id", state.roomId);
    return state.roomId;
}

window.RenewRoom = async function () {
 await  connection.invoke("RenewRoom", state.roomId);
}