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
    transforming: {
      transformation: null
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
 */
function setScaling() {
  setTransformation('scale')
}

/**
 * @returns {?Transformation}
 */
function getTransformation() {
  return state.transforming.transformation;
}

/**
 */
function clearTransformation() {
  state.transforming.transformation = null;
}
