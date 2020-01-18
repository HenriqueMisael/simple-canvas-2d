const canvasTop = 50;
const canvasLeft = 120;
let label, firstInput, secondInput, buttonApply;

function setup() {
  label = createSpan('');
  firstInput = createInput('');
  secondInput = createInput('');
  buttonApply = createButton('Aplicar');
  clearState();
  createCanvas(800, 600);
  drawLayout();
  setFrameRate(5);
  angleMode(DEGREES);
}

function draw() {
  drawCanvas();
  drawShapes();
}

function mousePressed({x, y}) {
  if (x < canvasLeft || y < canvasTop) return;

  if (isDrawing())
    addDot(createVector(x, y));
  if (isSelecting()) {
    const clicked = getShapes().find(shape => checkDotInsideShape(shape, createVector(x, y, 1)));

    if (clicked) setSelected(clicked.id);
    else setSelected(null);
  }
}

function drawShapes() {
  drawCurrentSchema();

  getShapes().forEach(shape => {

    if (isShapeSelected(shape)) {
      stroke('red');
    } else {
      stroke('black');
    }

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
  stroke(`black`);
  rect(canvasLeft, canvasTop, width - canvasLeft, height - canvasTop);
}

function drawLayout() {
  background(240);
  drawCanvas();

  drawButtonTop('Clear', 0, clearState);
  drawButtonTop('Rotação', 1, () => {
    setRotate();
    firstInput.show();
    firstInput.size(32, 16);
    firstInput.value(0);
    buttonApply.show();
    buttonApply.position(6 * canvasLeft + 48, 1);
    label.html('Grau de rotação:');
  });
  drawButtonTop('Escala', 2);
  drawButtonTop('Translação', 3);
  label.position(5 * canvasLeft, canvasTop / 3);
  label.style('display', 'hidden');
  firstInput.position(6 * canvasLeft, canvasTop / 3);
  firstInput.hide();
  secondInput.position(7 * canvasLeft, canvasTop / 3);
  secondInput.hide();
  secondInput.size(48, 16);
  buttonApply.hide();
  buttonApply.size(64, 48);
  buttonApply.mousePressed(() => {
    applyTransformation([firstInput.value(), secondInput.value()]);
    label.html('');
    firstInput.hide();
    secondInput.hide();
    buttonApply.hide();
  });

  drawButtonSide('Reta', 0, setDrawingLine);
  drawButtonSide('Triângulo', 1, setDrawingTriangle);
  drawButtonSide('Quadrilátero', 2, setDrawingRectangle);
  drawButtonSide('Circunferência', 3, setDrawingCircle);
}

function drawButtonTop(buttonName, buttonID, onClick) {
  drawButton(buttonName, 0, (buttonID + 1) * canvasLeft, onClick);
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
