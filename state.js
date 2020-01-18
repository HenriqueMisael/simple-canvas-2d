/**
 * @typedef {Object} Vector
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef { 'circle' | 'line' | 'polygon'} ShapeType
 */

/**
 * @typedef {Object} Shape
 * @property {string} id
 * @property {ShapeType} type
 * @property {Array<Vector>} dots
 */

/**
 * @typedef {Object} Drawing
 * @property {boolean} isDrawing
 * @property {number} dotsLeft
 * @property {?ShapeType} shapeType
 */

/**
 * @typedef {Object} Selecting
 * @property {boolean} isSelecting
 * @property {?string} selected
 */

/**
 * @typedef {'rotate' | 'scale' | 'translate'} Transformation
 */

/**
 * @typedef {Object} Transforming
 * @property {?Transformation} transformation
 */

/**
 * @typedef {Object} State
 * @property {Selecting} selecting
 * @property {Drawing} drawing
 * @property {Transforming} transforming
 * @property {Array<Vector>} dots
 * @property {Array<Shape>} shapes
 */

/**
 * @type {State}
 */
let state;

/**
 */
function clearState() {
  state = {
    selecting: {
      isSelecting: true,
      selected: null
    },
    drawing: {
      isDrawing: false,
      dotsLeft: 0,
      shapeType: null
    },
    dots: [],
    shapes: []
  }
}

/**
 * @param {?function({State})} filter
 */
function printState(filter = s => s) {
  console.log(filter(state));
}

/**
 * @returns {boolean}
 */
function isDrawing() {
  return state.drawing.isDrawing;
}

/**
 * @returns {boolean}
 */
function isSelecting() {
  return state.selecting.isSelecting;
}

/**
 * @returns {boolean}
 */
function isTransforming() {
  return !!state.transforming.transformation;
}

/**
 * @returns {Array<Vector>}
 */
function getDots() {
  return state.dots;
}

/**
 * @returns {Array<Shape>}
 */
function getShapes() {
  return state.shapes;
}

/**
 * @param {Vector} vector
 */
function addDot(vector) {
  state.dots.push(vector);
  state.drawing.dotsLeft--;

  if (state.drawing.dotsLeft === 0) {
    addShape(state.drawing.shapeType, state.dots);

    state.dots = [];
    state.drawing.shapeType = null;
    state.drawing.isDrawing = false;
    state.selecting.isSelecting = true;
  }
}

/**
 * @param {ShapeType} type
 * @param {Array<Vector>} dots
 */
function addShape(type, dots) {
  const id = `${type}${state.shapes.filter((shape) => shape.type === type).length}`;
  state.shapes.push({id, type, dots: [...dots]});
}

/**
 * @param {?string} shapeID
 */
function setSelected(shapeID) {
  state.selecting.selected = shapeID;
}

/**
 * @return {?Shape}
 */
function getSelectedShape() {
  if (!state.selecting.selected) {
    return null;
  }
  return state.shapes.find(({id}) => id === state.selecting.selected);
}

/**
 * @param {Shape} shape
 */
function isShapeSelected({id}) {
  return state.selecting.selected === id;
}

/**
 * @param {ShapeType} shapeType
 * @param {number} dotsLeft
 */
function setDrawing(shapeType, dotsLeft) {
  state.selecting.isSelecting = false;
  state.drawing.isDrawing = true;
  state.drawing.shapeType = shapeType;
  state.drawing.dotsLeft = dotsLeft;
}

/**
 */
function setDrawingLine() {
  setDrawing('line', 2);
}

/**
 */
function setDrawingTriangle() {
  setDrawing('polygon', 3);
}

/**
 */
function setDrawingRectangle() {
  setDrawing('polygon', 4);
}

/**
 */
function setDrawingCircle() {
  setDrawing('circle', 2);
}

/**
 * @param {Transformation} transformation
 */
function setTransformation(transformation) {
  state.transforming = {transformation};
}

/**
 */
function setRotate() {
  setTransformation('rotate')
}

/**
 */
function setTranslate() {
  setTransformation('translate')
}

/**
 * @param {[number, number, number]} matrixLine
 * @param {Vector} source
 */
function calculateCoord(matrixLine, source) {
  return matrixLine.reduce((acc, value) => acc + (value * source.x + value * source.y + value * source.z), 0);
}

/**
 * @param {Shape} shape
 * @param {number} angle
 */
function rotate(shape, angle) {
  const transformationMatrix = [
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1]
  ];

  shape.dots = shape.dots.map((vector) => createVector(
    calculateCoord(transformationMatrix[0], vector),
    calculateCoord(transformationMatrix[1], vector),
    calculateCoord(transformationMatrix[2], vector))
  );
}

/**
 * @param {Shape} shape
 * @param {number} dX
 * @param {number} dY
 */
function doTranslate(shape, dX, dY) {
  shape.dots = shape.dots.map(({x, y, z}) => createVector(x + dX, y + dY, z));
}

/**
 * @param {Array<number>} args
 */
function applyTransformation(args) {
  if (isTransforming()) {
    const selected = getSelectedShape();
    switch (state.transforming.transformation) {
      case 'rotate':
        const [angle] = args;
        rotate(selected, angle);
        break;
      case 'translate':
        const [dX, dY] = args;
        doTranslate(selected, dX, dY);
        break;
      default:
        console.log('Transformação desconhecida.');
    }
    state.transforming.transformation = null;
  }
}
