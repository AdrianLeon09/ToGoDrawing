window.DragEvents = function () {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    let Points = [];
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    document.body.style.cursor = "crosshair";

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);


    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;

        //mandar estas informaciones directamente por SignalR?

 
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
