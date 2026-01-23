// --- State & Constants ---

const state = {username: "",
    roomId: "",
    inRoom: false,
    pencilMode: "",
    currentIndex: 0, // Index of the path currently rendered
    drawing: false,
    internalStrokes: [],
    externalStrokes: [],
    temporalInternalStrokes: [],
    lastSendTime: 0,
    sendInterval: 30, // milliseconds
    defaultSizeEraser: 20,
    currentStrokeIndex: 0,
    color : "#000000" //Default
};

window.canvasGlobal = {
    canvas: null,
    ctx: null
};

window.SendInternalStrokes = async function () {
    if (state.inRoom && signalR.HubConnectionState.Connected) {
        try {
            await window.connection.invoke("SendStrokesServer", state.roomId, state.username, state.internalStrokes);
        } catch (err) {
            console.error("Error sending username or strokes:", err);
        }
    } else {
        console.warn("Connection not established yet");
    }
};

// --- Canvas Utilities ---
function GetCanvasCoords(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function ClearCanvas() {
    if (window.canvasGlobal.ctx && window.canvasGlobal.canvas) {
        window.canvasGlobal.ctx.clearRect(0, 0, window.canvasGlobal.canvas.width, window.canvasGlobal.canvas.height);
    }
}

// --- Public API (Window Functions) ---

window.InitCanvas = function () {
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
        state.internalStrokes.push({ points: [], color: state.color });
        state.currentStrokeIndex = state.internalStrokes.length - 1;
        state.currentIndex = state.internalStrokes.length;
        state.drawing = true;

        const pos = GetCanvasCoords(e, canvas);
        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener("mousemove", async (e) => {
        const pos = GetCanvasCoords(e, canvas);

        if (state.drawing) {
            if (state.pencilMode === "pencil") {
                ctx.beginPath();
                ctx.strokeStyle = state.color;
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(pos.x, pos.y);
                state.internalStrokes[state.currentStrokeIndex].points.push({x: pos.x, y: pos.y});
                ctx.stroke();
                lastX = pos.x;
                lastY = pos.y;
            } else if (state.pencilMode === "eraser") {
                ctx.clearRect(pos.x, pos.y, state.defaultSizeEraser, state.defaultSizeEraser);
            }

            // Throttle SignalR updates
            const now = Date.now();
            if (now - state.lastSendTime > state.sendInterval) {
                await window.SendInternalStrokes();
                state.lastSendTime = now ;
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

window.UndoDrawing = async function () {
    if (state.internalStrokes.length === 0) {
        console.log("There are no more drawings to Undo");
        return;
    }
    state.internalStrokes.pop();
    state.currentIndex = state.internalStrokes.length;
    console.log(state.currentIndex);
    await window.SendInternalStrokes();
    window.DrawMapStrokes();
};

window.RedoDrawing = async function () {
    if (state.currentIndex === state.temporalInternalStrokes.length) {
        console.log("there are no more drawings to redo");
        return;
    }

    state.internalStrokes.push(state.temporalInternalStrokes[state.currentIndex]);
    state.currentIndex++;
    console.log(state.currentIndex);
    await window.SendInternalStrokes();
    window.DrawMapStrokes();
};

window.ReceiveUsername = function (user) {
    state.username = user;
}

window.RenderDrawing = function (strokes) {
    const ctx = window.canvasGlobal.ctx;
    if (!ctx || !strokes) return;

    strokes.forEach(stroke => {
        if (stroke.points && stroke.points.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = stroke.color;
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            stroke.points.forEach(p => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        }
    });
};

window.SetModePencil = function () {
    if (window.canvasGlobal.canvas) {
        window.canvasGlobal.canvas.style.cursor = "url('icons/point.png') 16 16, auto";
    }
    state.pencilMode = "pencil";
};

window.SetModeEraser = function () {
    if (window.canvasGlobal.canvas) {
        window.canvasGlobal.canvas.style.cursor = "url('icons/eraser-cursor32px.png') 0 0, auto";
    }
    state.pencilMode = "eraser";
};
