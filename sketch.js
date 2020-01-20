const canvasTop = 50;
const canvasLeft = 120;
let label, firstInput, secondInput, buttonApply, reference;

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

  label = createSpan('');
  firstInput = createInput('');
  secondInput = createInput('');
  buttonApply = createButton('Aplicar');
  reference = createSpan();
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

  if (isDrawing()) {
    addDot(createVector(x, y, 1));
  } else if (isTransforming()) {
    setReferencePoint(createVector(x, y, 1));
  } else if (isSelecting()) {
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
  } else if (isTransforming()) {
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
  rect(canvasLeft, canvasTop, width - canvasLeft, height - canvasTop);
  if (isTransforming()) {
    reference.html(`Eixo de referência: (${getReferencePoint().x}, ${getReferencePoint().y})`);
    reference.position(canvasLeft + 4, canvasTop + 4);
  } else {
    reference.html();
  }
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
    label.position(5 * canvasLeft, canvasTop / 3);
  });
  drawButtonTop('Escala', 2, () => {
    setScaling();
    firstInput.show();
    firstInput.size(28, 16);
    firstInput.value(0);
    secondInput.show();
    secondInput.size(28, 16);
    secondInput.value(0);
    secondInput.position(6 * canvasLeft + 32, canvasTop / 3);
    buttonApply.show();
    buttonApply.position(6 * canvasLeft + 64, 1);
    label.html('Razão de escala (x,y):');
    label.position(5 * canvasLeft - 12, canvasTop / 3);
  });
  drawButtonTop('Translação', 3, () => {
    setTranslate();
    firstInput.show();
    firstInput.size(28, 16);
    firstInput.value(0);
    secondInput.show();
    secondInput.size(28, 16);
    secondInput.value(0);
    secondInput.position(6 * canvasLeft + 32, canvasTop / 3);
    buttonApply.show();
    buttonApply.position(6 * canvasLeft + 64, 1);
    label.html('Deslocamento (x,y):');
    label.position(5 * canvasLeft - 4, canvasTop / 3);
  });
  drawButtonTop('');

  firstInput.position(6 * canvasLeft, canvasTop / 3);
  firstInput.hide();
  secondInput.position(7 * canvasLeft, canvasTop / 3);
  secondInput.hide();
  secondInput.size(48, 16);
  buttonApply.hide();
  buttonApply.size(64, 48);
  buttonApply.mousePressed(() => {
    applyTransformation([Number(firstInput.value()), Number(secondInput.value())]);
    label.html('');
    firstInput.hide();
    secondInput.hide();
    buttonApply.hide();
  });

  drawButtonSide('Reta', 0, setDrawingLine);
  drawButtonSide('Triângulo', 1, setDrawingTriangle);
  drawButtonSide('Quadrilátero', 2, setDrawingRectangle);
  drawButtonSide('Pentágono', 3, () => setDrawingPolygon(5));
  drawButtonSide('Hexágono', 4, () => setDrawingPolygon(6));
  drawButtonSide('Heptágono', 5, () => setDrawingPolygon(7));
  drawButtonSide('Circunferência', 6, setDrawingCircle);

  const helpDiv = createDiv(`
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
    <span>
      Os botões acima representam ações sobre formas no canvas.
    </span>
    <ul>
      <li>O primeiro botão <strong>Clear</strong> remove todas as formas anteriormente definidas.</li>
      <li>Os botões seguintes realizam operações sobre uma forma selecionada antes de escolher a transformação. Após selecionar a transformação, é possível escolher um ponto de referência para realizar as operações (o padrão é utilizar a origem).</li>
      <ul>
        <li>O segundo botão <strong>Rotação</strong> requer um ângulo (em graus) para rotacionar ao redor do eixo de referência</li>
        <li>O terceiro botão <strong>Escala</strong> permite informar uma razão para escalonar o objeto em X e Y individualmente</li>
        <li>O quarto botão <strong>Translação</strong> requer uma quantidade de pixels para movimentar o objeto no eixo X e no eixo Y</li>
      </ul>
    </ul>
  `);
  helpDiv.position(0, height);
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
