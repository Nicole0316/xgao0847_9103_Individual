let grid  = 20;
let wide = 34 * grid;
let height = wide;

let colour = {
    W : '#ffffff',
    Y : '#f6e64b',
    R : '#b33025',
    B : '#2d59b5',
    G : '#d8d8d8',
};

let origBlocks = [
    {col:1,  row:4,  w:1, h:1, colour:colour.G},
    {col:1,  row:10, w:3, h:3, colour:colour.R},
    {col:1,  row:26, w:3, h:3, colour:colour.R},
    {col:5,  row:22, w:1, h:1, colour:colour.G},
    {col:9,  row:1,  w:1, h:1, colour:colour.G},
    {col:10, row:4,  w:1, h:1, colour:colour.R},
    {col:11, row:7,  w:3, h:6, colour:colour.B},
    {col:11, row:9,  w:1, h:2, colour:colour.R},
    {col:11, row:15, w:1, h:1, colour:colour.G},
    {col:11, row:22, w:3, h:3, colour:colour.R},
    {col:11, row:28, w:1, h:1, colour:colour.G},
    {col:15, row:28, w:1, h:1, colour:colour.B},

{col: 3, row: 13, w: 2, h: 1, colour: colour.R},
{col: 21, row: 27, w: 1, h: 2, colour: colour.R},

{col: 7, row: 1, w: 1, h: 1, colour: colour.B},
{col: 29, row: 16, w: 1, h: 2, colour: colour.B},

{col: 12, row: 19, w: 2, h: 1, colour: colour.G},

];

let blocks = [];
origBlocks.forEach(def => {
    for (let i = 0; i < def.w; i++) {
    for (let j = 0; j < def.h; j++) {
        blocks.push({
        w:1, h:1, colour:def.colour,
        targetX: (def.col + i) * grid,
        targetY: (def.row + j) * grid,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        landed: false,
        lastCollision: 0
        });
    }
    }
});


let vLines = [1, 3, 7, 12, 21, 29, 32];
let hLines = [1, 5, 11, 13, 16, 19, 27, 32];

function setup() {
    createCanvas(wide, height);
    noStroke(); 
    blocks.forEach(b => {
    b.x  = random(-grid * 2, wide - grid + grid * 2);
    b.y  = random(-height * 2, -grid);
    b.vx = random(-3, 3);
    b.vy = 0;
    b.landed = false;
});

}

function draw() {
    background(colour.W);    
    fill(colour.Y);
    vLines.forEach(c => rect(c * grid, 0, grid, height));
    hLines.forEach(r => rect(0, r * grid, wide, grid));

    let now = millis();
    const collisionCooldown = 300;
    const bounceFactor       = 1.5;
    let g = 0.1;
    let friction = 1;

blocks.forEach((b, idx) => {
if (!b.landed) {
    b.vy += g;          
    b.y  += b.vy;
    b.vx *= friction;    
    b.x  += b.vx;

if (b.x < 0) {
    b.x = 0;
    b.vx *= -0.8;
}
if (b.x + grid > wide) {
    b.x = wide - grid;
    b.vx *= -0.8;
}
if (b.y < 0) {
    b.y = 0;
    b.vy *= -0.8;
}

    if (b.y >= b.targetY) {
        b.y = b.targetY;
        b.vy *= -0.7;
        if (abs(b.vy) < 0.5) {
            b.vy = 0;
            b.landed = true;
            b.x = b.targetX;
        }
    }

}

for (let j = idx + 1; j < blocks.length; j++) {
    let o = blocks[j];
    if (!o.landed &&
        b.x < o.x + o.w*grid &&
        b.x + b.w*grid > o.x &&
        b.y < o.y + o.h*grid &&
        b.y + b.h*grid > o.y) {
    [b.vx, o.vx] = [o.vx, b.vx];
    [b.vy, o.vy] = [o.vy, b.vy];
    if (b.x < o.x) b.x = o.x - b.w*grid;
    else           b.x = o.x + o.w*grid;
    }
    }

    fill(b.colour);
    rect(b.x, b.y, b.w * grid, b.h * grid);
    });
}
