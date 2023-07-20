let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let ballRadius = 10;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 8;
let dy = -8;
// chiều rộng và chiều cao thanh chắn
let paddleHeight = 10;
let paddleWidth = 100;

// paddleX là 1 nửa giá trị của khoảng trắng còn lại sau khi trừ đi độ rộng thanh chắn
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;
// Số lượng gạch trên mỗi hàng cột
let brickRowCount = 11;
let brickColumnCount = 5;
// Khai báo thông số các viên gạch
let brickWidth = 60;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 40;
let brickOffsetLeft = 20;
let score = 0;
let lives = 2;

// render ra các viên gạch
let bricks = [];
for (i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (j = 0; j < brickRowCount; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Hàm lắng nghe sự kiện bàn phím
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

// Hàm di chuyển chuột
function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth;
    }
}

// Hàm phát hiện các va chạm giữa bóng và gạch
function collisionDetection() {
    for (i = 0; i < brickColumnCount; i++) {
        for (j = 0; j < brickRowCount; j++) {
            let b = bricks[i][j];
            if (b.status == 1) {
                if ((x + ballRadius) > b.x && (x - ballRadius) < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("Thắng rồi, Biết chơi đấy!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Hàm vẽ quả bóng
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

// Hàm vẽ thanh chắn
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "brown";
    ctx.fill();
    ctx.closePath();
}

// hàm vẽ các viên gạch
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "green";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Hàm tính điểm
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 18, 20);
}

// Hàm đếm số lượt chơi còn lại
function drawLives() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: " + lives, canvas.width - 85, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                alert("Trình độ chơi game quá tệ, điểm chơi dc là: " + score);
                document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 7;
                dy = -7;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();