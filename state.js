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
 * @property {Array<string>} selected
 */

/**
 * @typedef {'rotate' | 'scale' | 'translate'} Transformation
 */

/**
 * @typedef {Object} Transforming
 * @property {Vector} referencePoint
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
      selected: []
    },
    drawing: {
      isDrawing: false,
      dotsLeft: 0,
      shapeType: null
    },
    transforming: {
      referencePoint: createVector(0, 0, 1),
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
  return state.selecting.isSelecting && !isChangingReference();
}

/**
 * @returns {boolean}
 */
function isChangingReference() {
  return !state.transforming.referencePoint;
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
  state.selecting.selected = [shapeID];
}

/**
 * @param {string} shapeID
 */
function addSelected(shapeID) {
  state.selecting.selected.push(shapeID);
}

/**
 * @param {string} shapeID
 */
function removeSelected(shapeID) {
  state.selecting.selected = state.selecting.selected.filter(selected => selected !== shapeID);
}

/**
 */
function clearSelected() {
  state.selecting.selected = [];
}


/**
 * @param {string} id
 * @return {Shape}
 */
function getShapeByID(id) {
  return state.shapes.find(({id}) => id === state.selecting.selected);
}

/**
 * @return {Array<Shape>}
 */
function getSelectedShapes() {
  return state.selecting.selected.map(id => getShapeByID(id));
}

/**
 * @param {Shape} shape
 */
function isShapeSelected({id}) {
  return state.selecting.selected.includes(id);
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
 * @param {number} dotsCount
 */
function setDrawingPolygon(dotsCount) {
  setDrawing('polygon', dotsCount);
}

/**
 */
function setDrawingTriangle() {
  setDrawingPolygon(3)
}

/**
 */
function setDrawingRectangle() {
  setDrawingPolygon(4);
}

/**
 */
function setDrawingCircle() {
  setDrawing('circle', 2);
}

/**
 * @returns {Vector}
 */
function getReferencePoint() {
  return state.transforming.referencePoint;
}

/**
 * @param {?Vector} referencePoint
 */
function setReferencePoint(referencePoint) {
  state.transforming.referencePoint = referencePoint;
}
