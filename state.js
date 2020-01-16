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
 * @typedef {Object} State
 * @property {Drawing} drawing
 * @property {Array<Vector>} dots
 * @property {Array<Shape>} shapes
 */

/**
 * @type {State}
 */
const state = {
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
  }
}

/**
 * @param {ShapeType} type
 * @param {Array<Vector>} dots
 */
function addShape(type, dots) {
  state.shapes.push({type, dots});
}

/**
 */
function setDrawingLine() {
  state.drawing.shapeType = 'line';
  state.drawing.isDrawing = true;
  state.drawing.dotsLeft = 2;
}
