const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.strokeStyle = "red";
ctx.lineWidth = 1;


function draw(x, y, x5, y5) {
    ctx.beginPath();
    ctx.lineTo(x, y)
    ctx.lineTo(x5, y5)
    ctx.fill()
    ctx.stroke()
}

const RIGHT_TURN = Math.PI/2

function animate(gen, acc) {
    
    draw(0,0, 5, 0);
    ctx.rotate(RIGHT_TURN)

    draw(5,0, 5, 5);
    ctx.rotate(RIGHT_TURN)

    draw(5,5, -5, 5);
    ctx.rotate(RIGHT_TURN)

    draw(-5, 5, -5, -5);
    ctx.rotate(RIGHT_TURN)

    draw(-5, -5, -5, 0);

    console.log('hi')
}

animate(0, 0);
