/**
 * @param {[Vector, Vector, Vector]} matrix
 * @returns {[[number, number, number]]}
 */
function transposeMatrix(matrix) {
  return [
    matrix.map((vector) => vector.x),
    matrix.map((vector) => vector.y),
    matrix.map((vector) => vector.z),
  ]
}

/**
 * @param {[Vector, Vector, Vector]} matrix
 * @param {Vector} vector
 */
function multiplyMatrixVector(matrix, vector) {

  const vectorArray = vector.toArray();
  const transposedMatrix = transposeMatrix(matrix);

  const x1 = transposedMatrix[0].multiply(vectorArray).sum();
  const y1 = transposedMatrix[1].multiply(vectorArray).sum();
  const z1 = transposedMatrix[2].multiply(vectorArray).sum();

  return createVector(
    x1, y1, z1
  )
}

/**
 * @param {[Vector, Vector, Vector]} first
 * @param {Array<Vector>} second
 * @return {[Vector, Vector, Vector]}
 */
function multiplyMatrixMatrix(first, second) {

  const transposed = transposeMatrix(second);

  return first.map(column => createVector(
    transposed[0].multiply(column.toArray()).sum(),
    transposed[1].multiply(column.toArray()).sum(),
    transposed[2].multiply(column.toArray()).sum(),
  ));
}

/**
 * @param {Array<[Vector, Vector, Vector]>} matrices
 */
function multiplyMatrices(matrices) {
  return matrices.reduce((resultMatrix, current) => multiplyMatrixMatrix(resultMatrix, current), [
    createVector(1, 0, 0),
    createVector(0, 1, 0),
    createVector(0, 0, 1),
  ]);
}

/**
 */
function test() {
  const matrix = [
    createVector(3, 3, 1),
    createVector(6, 3, 1),
    createVector(6, 5, 1),
  ];
  console.log('before', matrix);
  console.log('after', multiplyMatrices([
    matrix,
    getTranslateMatrix(-3, -3),
    getScaleMatrix(2, 1),
    getTranslateMatrix(3, 3),
  ]));
}

/**
 *
 * @param {number} ratioX
 * @param {number} ratioY
 * @returns {Array<Vector>}
 */
function getScaleMatrix(ratioX, ratioY) {
  return [
    createVector(ratioX, 0, 0),
    createVector(0, ratioY, 0),
    createVector(0, 0, 1),
  ];
}

/**
 *
 * @param {number} angle
 * @returns {Array<Vector>}
 */
function getRotationMatrix(angle) {
  return [
    createVector(cos(angle), sin(angle), 0),
    createVector(-sin(angle), cos(angle), 0),
    createVector(0, 0, 1),
  ];
}

/**
 *
 * @param {number} dX
 * @param {number} dY
 * @returns {Array<Vector>}
 */
function getTranslateMatrix(dX, dY) {
  return [
    createVector(1, 0, 0),
    createVector(0, 1, 0),
    createVector(dX, dY, 1),
  ];
}

/**
 * @param {Shape} shape
 * @param {number} ratioX
 * @param {number} ratioY
 */
function doScale(shape, ratioX, ratioY) {
  const referencePoint = getReferencePoint();
  const {y, x} = referencePoint;
  shape.dots = multiplyMatrices([
    shape.dots,
    getTranslateMatrix(-x, -y),
    getScaleMatrix(ratioX, ratioY),
    getTranslateMatrix(x, y)
  ]);
}

/**
 * @param {Shape} shape
 * @param {number} angle
 */
function doRotate(shape, angle) {
  const referencePoint = getReferencePoint();
  const {y, x} = referencePoint;
  shape.dots = multiplyMatrices([
    shape.dots,
    getTranslateMatrix(-x, -y),
    getRotationMatrix(angle),
    getTranslateMatrix(x, y)
  ]);
}

/**
 * @param {Shape} shape
 * @param {number} dX
 * @param {number} dY
 */
function doTranslate(shape, dX, dY) {
  shape.dots = shape.dots.map(vector => multiplyMatrixVector(
    getTranslateMatrix(dX, dY),
    vector)
  );
}

/**
 * @param {Array<number>} args
 */
function applyTransformation(args) {
  if (isTransforming()) {
    const selected = getSelectedShape();
    switch (getTransformation()) {
      case 'scale':
        const [ratioX, ratioY] = args;
        doScale(selected, ratioX, ratioY);
        break;
      case 'rotate':
        const [angle] = args;
        doRotate(selected, angle);
        break;
      case 'translate':
        const [dX, dY] = args;
        doTranslate(selected, dX, dY);
        break;
      default:
        console.log('Transformação desconhecida.');
    }
    clearTransformation();
  }
}
