

let pencilMode = "";

window.canvasGlobal = {
    canvas: null,
    ctx: null
};

window.historyGlobal = {
    historyPencil: null
}


window.InitCanvas = function () {
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    let defaultSizeEraser = 20;
    let historyPencil = [];
    
    const canvas = document.getElementById("drawing-background");
    const ctx = canvas.getContext("2d");
    window.canvasGlobal.canvas = canvas;
    window.canvasGlobal.ctx = ctx;
    window.historyGlobal.historyPencil = historyPencil;
    
    
    
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
        drawing = true;
        const pos = getCanvasCoords(e);
        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener("mousemove", (e) => {
        const pos = getCanvasCoords(e);

        if (pencilMode === "pencil" && drawing ) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
            
        historyPencil.push([pos.x, pos.y]);
        
        
            lastX = pos.x;
            lastY = pos.y;
        }

        if (pencilMode === "eraser") {
        ctx.clearRect(pos.x, pos.y, defaultSizeEraser,defaultSizeEraser)
            historyPencil.push([pos.x, pos.y]);
        }
        
    });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
    });

    canvas.addEventListener("mouseleave", () => {
        drawing = false;
    });
}

window.setModePencil = function () {
    window.canvasGlobal.canvas.style.cursor = "url('icons/point.png') 16 16, auto";
    pencilMode = "pencil";
}

window.setModeEraser = function() {
    pencilMode = "eraser";
    window.canvasGlobal.canvas.style.cursor = "url('icons/eraser-cursor32px.png') 0 0, auto";
}

   


