// --- State & Constants ---
const state = {
    pencilMode: "",
    currentIndex: 0, // Index of the path currently rendered
    drawing: false,
    internalStrokes: [],
    externalStrokes: [],
    temporalInternalStrokes: [],
    lastSendTime: 0,
    sendInterval: 30, // milliseconds
    defaultSizeEraser: 20,
    currentStrokeIndex: 0
};

window.canvasGlobal = {
    canvas: null,
    ctx: null
};

// --- SignalR Connection ---
const connection = new signalR.HubConnectionBuilder()
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

connection.onclose(async () => {
    await startSignalR();
});

connection.on("ReceiveStrokes", (strokes) => {
    console.log("Received strokes:", strokes);
    state.externalStrokes = strokes;
    window.DrawExternalStrokes(state.externalStrokes);
});

window.SendInternalStrokes = async function () {
    if (connection.state === signalR.HubConnectionState.Connected) {
        try {
            await connection.invoke("SendStrokesServer", state.internalStrokes);
        } catch (err) {
            console.error("Error sending strokes:", err);
        }
    } else {
        console.warn("Connection not established yet");
    }
};

// Initialize SignalR
startSignalR();

// --- Canvas Utilities ---
function getCanvasCoords(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function clearCanvas() {
    if (window.canvasGlobal.ctx && window.canvasGlobal.canvas) {
        window.canvasGlobal.ctx.clearRect(0, 0, window.canvasGlobal.canvas.width, window.canvasGlobal.canvas.height);
    }
}

// --- Public API (Window Functions) ---

window.initCanvas = function () {
    const canvas = document.getElementById("drawing-background");
    if (!canvas) {
        console.error("Canvas element 'drawing-background' not found.");
        return;
    }
    const ctx = canvas.getContext("2d");
    window.canvasGlobal.canvas = canvas;
    window.canvasGlobal.ctx = ctx;

    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener("mousedown", (e) => {
        state.internalStrokes.push({ points: [], color: "#000000" });
        state.currentStrokeIndex = state.internalStrokes.length - 1;
        state.currentIndex = state.internalStrokes.length;
        state.drawing = true;

        const pos = getCanvasCoords(e, canvas);
        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener("mousemove", (e) => {
        const pos = getCanvasCoords(e, canvas);

        if (state.drawing) {
            if (state.pencilMode === "pencil") {
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(pos.x, pos.y);
                state.internalStrokes[state.currentStrokeIndex].points.push({ x: pos.x, y: pos.y });
                ctx.stroke();
                lastX = pos.x;
                lastY = pos.y;
            } else if (state.pencilMode === "eraser") {
                ctx.clearRect(pos.x, pos.y, state.defaultSizeEraser, state.defaultSizeEraser);
            }

            // Throttle SignalR updates
            const now = Date.now();
            if (now - state.lastSendTime > state.sendInterval) {
                window.SendInternalStrokes();
                state.lastSendTime = now;
            }
        }
    });

    const handleMouseUpOrLeave = () => {
        if (!state.drawing) return;
        
        state.drawing = false;
        if (state.pencilMode === "eraser") {
            state.internalStrokes.pop();
        }

        state.temporalInternalStrokes = [...state.internalStrokes];
        state.currentIndex = state.internalStrokes.length;
    };

    canvas.addEventListener("mouseup", handleMouseUpOrLeave);
    canvas.addEventListener("mouseleave", handleMouseUpOrLeave);
};

window.undoDrawing = function () {
    if (state.internalStrokes.length === 0) {
        console.log("There are no more drawings to Undo");
        return;
    }

    state.internalStrokes.pop();
    state.currentIndex = state.internalStrokes.length;
    
    window.DrawExternalStrokes(state.externalStrokes);
    window.SendInternalStrokes();
};

window.redoDrawing = function () {
    if (state.currentIndex >= state.temporalInternalStrokes.length) {
        return;
    }

    state.internalStrokes.push(state.temporalInternalStrokes[state.currentIndex]);
    state.currentIndex++;

    window.DrawExternalStrokes(state.externalStrokes);
    window.SendInternalStrokes();
};

window.DrawExternalStrokes = function (externalStrokes) {
    state.externalStrokes = externalStrokes;
    clearCanvas();
    window.renderDrawing(state.internalStrokes);
    window.renderDrawing(state.externalStrokes);
};

window.renderDrawing = function (strokes) {
    const ctx = window.canvasGlobal.ctx;
    if (!ctx || !strokes) return;

    strokes.forEach(stroke => {
        if (stroke.points && stroke.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            stroke.points.forEach(p => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        }
    });
};

window.setModePencil = function () {
    if (window.canvasGlobal.canvas) {
        window.canvasGlobal.canvas.style.cursor = "url('icons/point.png') 16 16, auto";
    }
    state.pencilMode = "pencil";
};

window.setModeEraser = function () {
    if (window.canvasGlobal.canvas) {
        window.canvasGlobal.canvas.style.cursor = "url('icons/eraser-cursor32px.png') 0 0, auto";
    }
    state.pencilMode = "eraser";
};
    