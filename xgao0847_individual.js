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

let vLines = [1, 3, 7, 12, 21, 29, 32];
let hLines = [1, 5, 11, 13, 16, 19, 27, 32];

let blocks = [
    {col: 1, row:  4, w: 1, h: 1, colour: colour.G},
    {col: 1, row: 10, w: 3, h: 3, colour: colour.R},
    {col: 1, row: 26, w: 3, h: 3, colour: colour.R},
    {col: 5, row: 22, w: 1, h: 1, colour: colour.G},
    {col: 9, row:  1, w: 1, h: 1, colour: colour.G},
    {col: 10, row:  4, w: 1, h: 1, colour: colour.R},
    {col: 11, row:  7, w: 3, h: 6, colour: colour.B},
    {col: 11, row:  9, w: 1, h: 2, colour: colour.R},
    {col: 11, row: 15, w: 1, h: 1, colour: colour.G},
    {col: 11, row: 22, w: 3, h: 3, colour: colour.R},
    {col: 11, row: 28, w: 1, h: 1, colour: colour.G},
    {col: 15, row: 28, w: 1, h: 1, colour: colour.B},
];

let startTime;
let shownBlocks = 0;
let interval = 1200;

let dashInterval = 1000; 
let lastDashTime;
let vDashPositions = [];
let hDashPositions = [];

function setup() {
    createCanvas(wide, height);
    noStroke();
    startTime = millis();
    lastDashTime = startTime;              
    updateDashes();                           
}

function draw() {
    background(colour.W);
    

    fill(colour.Y);
    vLines.forEach(c => rect(c * grid, 0, grid, height));
    hLines.forEach(r => rect(0, r * grid, wide, grid));
    
    if (millis() - lastDashTime > dashInterval) {
        lastDashTime = millis();
        updateDashes();
    }

    drawDashes();

    let elapsed = millis() - startTime;
    shownBlocks = floor(elapsed / interval);

    for (let i = 0; i < min(shownBlocks, blocks.length); i++) {
        let b = blocks[i];
        fill(b.colour);
        rect(b.col * grid, b.row * grid, b.w * grid, b.h * grid);
    }

    if (shownBlocks >= blocks.length) {
        noLoop();
    }
}

function updateDashes() {
    vDashPositions = vLines.map((c, idx) => {
        let colPositions = [];
        for (let r = 0; r < height / grid; r++) {
            if (random() < 0.33) colPositions.push({row: r, colour: colourAt(idx, r)});
        }
        return colPositions;
    });
    hDashPositions = hLines.map((r, idx) => {
        let rowPositions = [];
        for (let c = 0; c < wide / grid; c++) {
            if (random() < 0.33) rowPositions.push({col: c, colour: colourAt(idx+2, c)});
        }
        return rowPositions;
    });
}

function drawDashes() {
    vDashPositions.forEach((colPositions, idx) => {
        let c = vLines[idx];
        colPositions.forEach(obj => {
            fill(obj.colour);
            rect(c * grid, obj.row * grid, grid, grid);
        });
    });

    hDashPositions.forEach((rowPositions, idx) => {
        let r = hLines[idx];
        rowPositions.forEach(obj => {
            fill(obj.colour);
            rect(obj.col * grid, r * grid, grid, grid);
        });
    });
}

function colourAt(idx, pos) {
    let accent = [colour.Y, colour.R, colour.B, colour.G];
    return accent[(pos + idx) % accent.length];
}
