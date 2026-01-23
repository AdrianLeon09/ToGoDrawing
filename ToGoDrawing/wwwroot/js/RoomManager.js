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
    window.RenderDrawing(state.internalStrokes);
   for(const[key, value] of Object.entries(StrokeMap)){
       if (key !== state.username){
           window.RenderDrawing(value);
       }
   }
};

window.CreateRoom = async function () {
    state.inRoom = true;
 const id = await connection.invoke("CreateRoom", state.username, state.internalStrokes);
 console.log("Room created: ", id);
    state.roomId = id;
 return id;
}

window.JoinRoom = async function (roomId) {
    state.inRoom = true;
    state.internalStrokes.splice(0, state.internalStrokes.length);
    await connection.invoke("JoinRoom", roomId);
    state.roomId = roomId;
    state.color = randomColor().toString();
   await RenewRoom();
}

window.SendRoomId  = async function() {
    return state.roomId;
}

window.RenewRoom = async function () {
 await  connection.invoke("RenewRoom", state.roomId);
}

