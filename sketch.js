const canvasTop = 50;
const canvasLeft = 120;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  drawLayout();
}

function drawLayout() {
  background(240);
  rect(canvasLeft, canvasTop, width - canvasLeft, height - canvasTop);
  drawButtonTop('Clear', 0);
  drawButtonTop('Rotação', 1);
  drawButtonTop('Escala', 2);
  drawButtonTop('Translação', 3);

  drawButtonSide('Reta', 0);
  drawButtonSide('Triângulo', 1);
  drawButtonSide('Quadrado', 2);
  drawButtonSide('Circunferência', 3);
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
