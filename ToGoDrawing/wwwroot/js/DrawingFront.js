window.DragEvents = function () {

    const canvas = document.getElementById("drawing-background");
    const ctx = canvas.getContext("2d");

    let Points = [];
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    
    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        lastX = e.offsetX;
        lastY = e.offsetY;
     });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
    });
};
