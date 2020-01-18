/**
 * @param {[Vector, Vector, Vector]} transformationMatrix
 * @param {Vector} vector
 */
function multiplyMatrixVector(transformationMatrix, vector) {

  const vectorArray = vector.toArray();

  const x1 = transformationMatrix.map((vector) => vector.x).multiply(vectorArray).sum();
  const y1 = transformationMatrix.map((vector) => vector.y).multiply(vectorArray).sum();
  const z1 = transformationMatrix.map((vector) => vector.z).multiply(vectorArray).sum();

  return createVector(
    x1, y1, z1
  )
}

/**
 * @param {Shape} shape
 * @param {number} angle
 */
function doRotate(shape, angle) {
  const transformationMatrix = [
    createVector(cos(angle), sin(angle), 0),
    createVector(-sin(angle), cos(angle), 0),
    createVector(0, 0, 1),
  ];

  shape.dots = shape.dots.map((vector) => multiplyMatrixVector(transformationMatrix, vector));
}

/**
 * @param {Shape} shape
 * @param {number} dX
 * @param {number} dY
 */
function doTranslate(shape, dX, dY) {
  const transformationMatrix = [
    createVector(1, 0, 0),
    createVector(0, 1, 0),
    createVector(dX, dY, 1),
  ];

  shape.dots = shape.dots.map(vector => multiplyMatrixVector(transformationMatrix, vector));
}

/**
 * @param {Array<number>} args
 */
function applyTransformation(args) {
  if (isTransforming()) {
    const selected = getSelectedShape();
    switch (getTransformation()) {
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
