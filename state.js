/**
 * @typedef {Object} Vector
 * @property {number} x
 * @property {number} y
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
 * @typedef {Object} State
 * @property {Selecting} selecting
 * @property {Drawing} drawing
 * @property {Array<Vector>} dots
 * @property {Array<Shape>} shapes
 */

/**
 * @type {State}
 */
const state = {
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
};

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
  state.shapes.push({id, type, dots});
}

/**
 * @param {?string} shapeID
 */
function setSelected(shapeID) {
  // state.selecting.isSelecting = false;
  state.selecting.selected = shapeID;
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
