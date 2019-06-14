
export default function tvstatic(canvas, ctx, scale) {
    scale = scale || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw the static on the buffer canvas
    for (var x = 0; x < canvas.width; x += scale) {
        for (var y = 0; y < canvas.height; y += scale) {
            if (Math.round(Math.random()))
                ctx.fillRect(x, y, scale, scale);
        }
    }
}