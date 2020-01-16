const canvasTop = 50;
const canvasLeft = 120;

function setup() {
  createCanvas(800, 600);
  drawLayout();
  setFrameRate(5);
}

function draw() {
  drawCanvas();
  drawShapes();
}

function mousePressed({x, y}) {
  if (x < canvasLeft || y < canvasTop) return;

  if (isDrawing())
    addDot(createVector(x, y));
}

function drawShapes() {
  drawCurrentSchema();

  fill(220);
  getShapes().forEach(shape => {
    switch (shape.type) {
      case 'line': {
        const [first, second] = shape.dots;
        drawShapeLine(first, second);
        break;
      }
      case 'polygon':
        drawShapePolygon(shape.dots);
        break;
      case 'circle': {
        const [first, second] = shape.dots;
        drawShapeCircle(first, second);
        break;
      }
      default:
        console.log('Error: unknown shape type:', shape.type);
    }
  });
}

function drawCurrentSchema() {
  strokeWeight(10);
  stroke('red');
  const dots = getDots();
  dots.forEach(({x, y}) => {
    point(x, y);
  });
  strokeWeight(1);
  stroke(180);
  if (dots.length > 1) {
    drawLinkingLines(dots);
  }
  stroke('black');
}

function drawCanvas() {
  fill(255);
  rect(canvasLeft, canvasTop, width - canvasLeft, height - canvasTop);
}

function drawLayout() {
  background(240);
  drawCanvas();

  drawButtonTop('Clear', 0);
  drawButtonTop('Rotação', 1);
  drawButtonTop('Escala', 2);
  drawButtonTop('Translação', 3);

  drawButtonSide('Reta', 0, setDrawingLine);
  drawButtonSide('Triângulo', 1, setDrawingTriangle);
  drawButtonSide('Quadrilátero', 2, setDrawingRectangle);
  drawButtonSide('Circunferência', 3, setDrawingCircle);
}

function drawButtonTop(buttonName, buttonID, onClick) {
  drawButton(buttonName, 0, buttonID * canvasLeft + canvasLeft, onClick);
}

function drawButtonSide(buttonName, buttonID, onClick) {
  drawButton(buttonName, (buttonID + 1) * canvasTop, 0, onClick);
}

function drawButton(buttonName, top, left, onClick = () => alert(buttonName)) {
  const button = createDiv(buttonName);
  button.position(left, top);
  button.mousePressed(onClick);
  button.size(canvasLeft, canvasTop);
  button.style('display', 'flex');
  button.style('justify-content', 'center');
  button.style('align-items', 'center');
  button.style('cursor', 'pointer');
}
