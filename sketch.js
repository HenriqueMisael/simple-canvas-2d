const canvasTop = 64;
const canvasLeft = 128;
let label, rotationInput, scaleXInput, scaleYInput, translateXInput, translateYInput,
  applyRotationButton, applyScaleButton, applyTranslateButton, reference;

/**
 * @returns {[number, number, number]}
 */
function vectorToArray() {
  return [this.x, this.y, this.z];
}

/**
 * returns {number}
 */
function arraySum() {
  return this.reduce((acc, current) => acc + current, 0);
}

/**
 * @param {Array<number>} other
 * @returns {Array<number>}
 */
function arrayMultiply(other) {
  return this.map((current, index) => current * other[index]);
}

p5.Vector.prototype.toArray = vectorToArray;

Array.prototype.sum = arraySum;

Array.prototype.multiply = arrayMultiply;

function setup() {
  reference = createSpan();
  const referenceButton = createButton('Mudar referêcia');
  referenceButton.mousePressed(() => setReferencePoint(null));
  createDivButtonTop(canvasTop, canvasLeft, 0, 0, [reference, referenceButton]);

  clearState();
  createCanvas(800, 400);
  drawLayout();
  setFrameRate(30);
  angleMode(DEGREES);
}

function createTransformationInput(label) {
  const input = createInput(0);
  input.size(32, 12);
  const labelElement = createSpan(label);

  const div = createDivChildren([labelElement, input]);
  labelElement.parent(div);
  input.parent(div);

  div.style('padding', '4px');

  return [input, div];
}

function createDivChildren(children) {
  const div = createDiv();
  div.style('display', 'flex');
  div.style('justify-content', 'space-between');

  children.forEach(child => child.parent(div));
  return div;
}

function createDivFlex(direction, border) {
  const div = createDiv();
  div.style('display', 'flex');
  div.style('justify-content', 'center');
  div.style('align-items', 'center');
  div.style('flex-direction', direction);
  div.style('border', border ? 'solid thin black' : '');
  return div;
}

function createDivButtonTop(height, width, x, y, children = [], direction = 'column') {
  const div = createDivFlex(direction, true);
  div.position(x, y);
  div.size(width, height);
  children.forEach(child => child.parent(div));
  return div
}

function draw() {
  drawCanvas();
  drawShapes();
}

function mousePressed({x, y}) {

  x -= canvasLeft;
  y -= canvasTop;

  if (x < 0 || y < 0) return;

  if (isDrawing()) {
    addDot(createVector(x, y, 1));
  } else if (isChangingReference()) {
    setReferencePoint(createVector(x, y, 1));
  } else if (isSelecting()) {
    const clicked = getShapes().find(shape => checkDotInsideShape(shape, createVector(x, y, 1)));
    if (keyIsDown(SHIFT)) {
      if (clicked)
        addSelected(clicked.id);
    } else if (keyIsDown(CONTROL)) {
      if (clicked)
        removeSelected(clicked.id);
    } else {
      if (!clicked) {
        clearSelected();
      } else {
        setSelected(clicked.id);
      }
    }
  }
}

function keyPressed({key}) {
  if (keyIsDown(CONTROL) && key.toLowerCase() === 'z') keyIsDown(SHIFT) ? redo() : undo();
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

  if (isDrawing()) {
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
  } else if (!isChangingReference()) {
    strokeWeight(10);
    stroke('blue');
    const {x, y} = getReferencePoint();
    point(x, y);
  }
  strokeWeight(1);
  stroke('black');
}

function drawCanvas() {
  stroke(`black`);
  rect(0, 0, width, height);

  const {x, y} = isChangingReference() ? getMouse() : getReferencePoint();
  reference.html(`(${x}, ${y})`);
}

function getMouse() {
  const x = Math.ceil(mouseX);
  const y = Math.ceil(mouseY);
  return {x, y}
}

function drawHelpDiv() {
  const helpDiv = createDiv(`
    <p>
      <span>
        Os botões à esquerda servem para criar formas diversas. Para desenhar, selecione uma forma e clique no canvas nos locais em que deseja criar os pontos da forma escolhida.
      </span>
      <ul>
        <li>Retas são formas com dois pontos, e uma linha é desenhada ligando-os.</li>        
        <li>Polígonos são formas com n pontos, com uma linha ligando cada ponto subsequente, incluindo o primeiro e o último.</li>
        <ul>        
          <li>Triângulos são polígonos de três pontos</li>
          <li>Quadriláteros são polígonos de quatro pontos</li>
          <li>...</li>
        </ul>
        <li>
          Círculos são formas com dois pontos, onde o primeiro ponto define o centro da reta e o segundo se encontra sobre o seu perímetro. A distância entre os dois pontos é o raio da circunferência.
        </li>        
      </ul>
    </p>
    <p>
      <span>
        Os botões acima representam ações sobre formas no canvas.
      </span>
      <ul>
        <li>O primeiro botão <strong>Mudar referência</strong> permite alterar o ponto de referência utilizado para escalonamento e rotação.</li>
        <li>O segundo botão <strong>Clear</strong> remove todas as formas anteriormente definidas.</li>
        <li>Os botões seguintes realizam operações sobre uma forma selecionada.</li>
        <ul>
          <li>O terceiro botão <strong>Rotação</strong> requer um ângulo (em graus) para rotacionar ao redor do eixo de referência</li>
          <li>O quarto botão <strong>Escala</strong> permite informar uma razão para escalonar o objeto em X e Y individualmente</li>
          <li>O quinto botão <strong>Translação</strong> requer uma quantidade de pixels para movimentar o objeto no eixo X e no eixo Y</li>
        </ul>
      </ul>
    </p>
    <p>
      Para selecionar uma forma, clique sobre ela.
    </p>
    <p>
      Para selecionar outras após ela sem perder a seleção, segure o botão SHIFT.
    </p>
    <p>
      Para desselecionar apenas uma forma, segure CONTROL e clique sobre ela.    
    </p>
  `);
  helpDiv.position(0, height + canvasTop);
}

function drawLayout() {
  background(240);
  drawCanvas();

  let rotationDiv, scaleXDiv, scaleYDiv, translateXDiv, translateYDiv;

  label = createSpan('');
  [rotationInput, rotationDiv] = createTransformationInput('Graus °');
  [scaleXInput, scaleXDiv] = createTransformationInput('dX');
  [scaleYInput, scaleYDiv] = createTransformationInput('dY');
  [translateXInput, translateXDiv] = createTransformationInput('Sx');
  [translateYInput, translateYDiv] = createTransformationInput('Sy');

  applyRotationButton = createButton('Rotacionar');
  applyRotationButton.mousePressed(() => applyRotate(Number(rotationInput.value())));
  applyScaleButton = createButton('Escalonar');
  applyScaleButton.mousePressed(() => applyScale(scaleXInput.value(), scaleYInput.value()));
  applyTranslateButton = createButton('Transladar');
  applyTranslateButton.mousePressed(() => applyTranslate(translateXInput.value(), translateYInput.value()));
  const clearButton = createButton('Clear');
  clearButton.mousePressed(clearState);
  const undoButton = createButton('Desfazer (Ctrl+Z)');
  undoButton.mousePressed(undo);
  const redoButton = createButton('Refazer (Ctrl+Shift+Z)');
  redoButton.mousePressed(undo);

  // const printStackButton = createButton('Print stack');
  // printStackButton.mousePressed(printStack);

  createDivButtonTop(canvasTop, canvasLeft, canvasLeft, 0, [clearButton]);
  createDivButtonTop(canvasTop, canvasLeft, canvasLeft * 2, 0, [rotationDiv, applyRotationButton]);
  createDivButtonTop(canvasTop, canvasLeft, canvasLeft * 3, 0, [createDivChildren([scaleXDiv, scaleYDiv]), applyScaleButton]);
  createDivButtonTop(canvasTop, canvasLeft, canvasLeft * 4, 0, [createDivChildren([translateXDiv, translateYDiv]), applyTranslateButton]);
  // createDivButtonTop(canvasTop, canvasLeft, canvasLeft * 5, 0, [printStackButton]);
  createDivButtonTop(canvasTop, canvasLeft * 1.5, canvasLeft * 5, 0, [undoButton, redoButton]);

  drawButtonSide('Reta', 0, setDrawingLine);
  drawButtonSide('Triângulo', 1, setDrawingTriangle);
  drawButtonSide('Quadrilátero', 2, setDrawingRectangle);
  drawButtonSide('Pentágono', 3, () => setDrawingPolygon(5));
  drawButtonSide('Hexágono', 4, () => setDrawingPolygon(6));
  drawButtonSide('Circunferência', 5, setDrawingCircle);

  drawHelpDiv();
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
