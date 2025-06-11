let grid  = 20;
let wide;
let height;

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

let minCol = Math.min(...origBlocks.map(b => b.col));
let maxCol = Math.max(...origBlocks.map(b => b.col + b.w));
let minRow = Math.min(...origBlocks.map(b => b.row));
let maxRow = Math.max(...origBlocks.map(b => b.row + b.h));

let contentWidth  = (maxCol - minCol) * grid;
let contentHeight = (maxRow - minRow) * grid;
wide = contentWidth + grid * 4;
height = contentHeight + grid * 4;

let offsetX = (wide - contentWidth) / 2 - minCol * grid;
let offsetY = (height - contentHeight) / 2 - minRow * grid;

let dotColors = [];
let lastColorUpdate = 0;

let blocks = [];
origBlocks.forEach(def => {
    for (let i = 0; i < def.w; i++) {
    for (let j = 0; j < def.h; j++) {
        blocks.push({
        w:1, h:1, colour:def.colour,
        targetX: (def.col + i) * grid + offsetX,
        targetY: (def.row + j) * grid + offsetY,
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

for (let i = 4; i < 28; i += 2) {
for (let j = 4; j < 28; j += 2) {
    let c = random([colour.R, colour.B, colour.G]);
    blocks.push({
    w: 1,
    h: 1,
    colour: c,
      targetX: i * grid + offsetX,
      targetY: j * grid + offsetY,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    landed: false,
    lastCollision: 0
    });
}
}


let vLines = [1, 3, 7, 12, 21, 29, 32];
let hLines = [1, 5, 11, 13, 16, 19, 27, 32];

function setup() {
    createCanvas(wide, height);
    noStroke();

let lineCols = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
let lineRows = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];

lineCols.forEach(col => {
    lineRows.forEach(row => {
    dotColors.push({
    x: col * grid + offsetX,
    y: row * grid + offsetY,
    c: random([colour.Y, colour.W, colour.G])
    });
    });
});

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

    let now = millis();
if (now - lastColorUpdate > 6000) {
    lastColorUpdate = now;
    dotColors.forEach(dot => {
    dot.c = random([colour.Y, colour.W, colour.G]);
    });
}

dotColors.forEach(dot => {
    fill(dot.c);
    rect(dot.x, 0, grid, height);
    rect(0, dot.y, wide, grid);
});

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

    fill(red(b.colour), green(b.colour), blue(b.colour), 220);
    rect(b.x, b.y, b.w * grid, b.h * grid);
    });
}
