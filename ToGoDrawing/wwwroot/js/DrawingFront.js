let pencilMode = "";
let currentIndex =  0 ; /* Index of the path currently rendered*/
let drawing = false;
let internalStrokes = [];
let externalStrokes = []
let updateDraw = false;
let temporalInternalStroke = [];
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/SendStrokesServer")
    .withAutomaticReconnect()
    .build();
let lastSendTime = 0;
const sendInterval = 30; 

window.canvasGlobal = {
    canvas: null,
    ctx: null
};

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
}
connection.onclose(async () => {await start();});
connection.on("ReceiveStrokes", function (strokes){
    console.log(strokes);
   externalStrokes = strokes;
   DrawExternalStrokes(externalStrokes);
        
});

window.SendInternalStrokes = async function () {
    if (connection.state === signalR.HubConnectionState.Connected) {
        try {
            await connection.invoke("SendStrokesServer", internalStrokes);
        } catch (err) {
            console.error(err);
        }
    } else {
        console.log("Connection not established yet");
    }
}

//start the connection SignalR
    start();

    window.initCanvas = function () {
        let lastX = 0;
        let lastY = 0;
        let defaultSizeEraser = 20;
        let currentStroke = 0;
        const canvas = document.getElementById("drawing-background");
        const ctx = canvas.getContext("2d");
        window.canvasGlobal.canvas = canvas;
        window.canvasGlobal.ctx = ctx;

        function getCanvasCoords(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }

        canvas.addEventListener("mousedown", (e) => {
            internalStrokes.push({points: [], color: "#000000"});
            currentStroke = internalStrokes.length - 1;
            currentIndex = internalStrokes.length;
            drawing = true;
            const pos = getCanvasCoords(e);
            lastX = pos.x;
            lastY = pos.y;


        });



canvas.addEventListener("mousemove", (e) => {
    const pos = getCanvasCoords(e);
    
    if (pencilMode === "pencil" && drawing) {
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        internalStrokes[currentStroke].points.push({x: pos.x, y: pos.y});
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
    }
    if (pencilMode === "eraser" && drawing) {
        ctx.clearRect(pos.x, pos.y, defaultSizeEraser, defaultSizeEraser);
    }

    const now = Date.now();
    if (now - lastSendTime > sendInterval) {
        SendInternalStrokes();
        lastSendTime = now;
    }
});

        canvas.addEventListener("mouseup", () => {
            drawing = false;
            if (pencilMode === "eraser") {
                internalStrokes.pop();
                currentIndex = internalStrokes.length;
            }

            temporalInternalStroke = [...internalStrokes];
            currentIndex = internalStrokes.length;
        });

        canvas.addEventListener("mouseleave", () => {
            drawing = false;
            if (pencilMode === "eraser") {
                internalStrokes.pop();
                currentIndex = internalStrokes.length;
            }

            temporalInternalStroke = [...internalStrokes];
            currentIndex = internalStrokes.length;
        });
    }

    window.undoDrawing = function () {
        updateDraw = true;
        
        if (internalStrokes.length === 0) {
            console.log("There are no more drawings to Undo");
            return;
        } else {
            window.canvasGlobal.ctx.clearRect(0, 0, canvasGlobal.canvas.width, canvasGlobal.canvas.height);
            internalStrokes.pop();
            currentIndex = internalStrokes.length;
            window.renderDrawing(internalStrokes);
        }
        SendInternalStrokes()
        window.renderDrawing(externalStrokes);
        }

    window.redoDrawing = function () {

    if (currentIndex >= temporalInternalStroke.length) {
        return;
    }
    internalStrokes.push(temporalInternalStroke[currentIndex]);
    currentIndex++;

    window.renderDrawing(internalStrokes);
    SendInternalStrokes()
    window.renderDrawing(externalStrokes);

}

    window.DrawExternalStrokes = function (externalStrokes) {
    canvasGlobal.ctx.clearRect(0, 0, canvasGlobal.canvas.width, canvasGlobal.canvas.height);
    window.renderDrawing(internalStrokes);
    window.renderDrawing(externalStrokes);
}

    window.renderDrawing = function (strokeObj){
        
    for (let stroke of strokeObj) {
        
        let x = stroke.points[0].x;
        let y = stroke.points[0].y;
        window.canvasGlobal.ctx.beginPath();
        window.canvasGlobal.ctx.moveTo(x, y);
        for (let i = 0; i < stroke.points.length; i++) {
            let p = stroke.points[i];
            window.canvasGlobal.ctx.lineTo(p.x, p.y);
            window.canvasGlobal.ctx.stroke();
        }
    }
}

    window.setModePencil = function () {
        window.canvasGlobal.canvas.style.cursor = "url('icons/point.png') 16 16, auto";
        pencilMode = "pencil";
    }
    
    window.setModeEraser = function () {
        pencilMode = "eraser";
        window.canvasGlobal.canvas.style.cursor = "url('icons/eraser-cursor32px.png') 0 0, auto";
    }
    