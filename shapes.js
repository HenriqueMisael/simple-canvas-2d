/**
 * @param {Array<Vector>}dots
 */
function drawLinkingLines(dots) {
  for (let i = 1; i < dots.length; i++) {
    const firstDot = dots[i - 1];
    const secondDot = dots[i];
    line(firstDot.x, firstDot.y, secondDot.x, secondDot.y);
  }
}

/**
 * @param {Vector} first
 * @param {Vector} second
 */
function drawShapeLine({x: x0, y: y0}, {x: x1, y: y1}) {
  line(x0, y0, x1, y1);
}

/**
 * @param {Array<Vector>} dots
 */
function drawShapePolygon(dots) {
  dots.push(dots[0]);
  drawLinkingLines(dots);
}

/**
 * @param {Vector} first
 * @param {Vector} second
 */
function drawShapeCircle(first, second) {
  const radius = p5.Vector.dist(first, second);
  const {x, y} = first;
  circle(x, y, radius * 2);
}

/**
 * @param {Vector} firstShapeDot
 * @param {Vector} secondShapeDot
 * @param {Vector} clickedDot
 * @param {Vector} extremeDot
 * @returns {boolean}
 */
function intersects(firstShapeDot, secondShapeDot, clickedDot, extremeDot) {
  let det, gamma, lambda;
  det = (secondShapeDot.x - firstShapeDot.x) * (extremeDot.y - clickedDot.y) - (extremeDot.x - clickedDot.x) * (secondShapeDot.y - firstShapeDot.y);
  if (det === 0) {
    return false;
  } else {
    lambda = ((extremeDot.y - clickedDot.y) * (extremeDot.x - firstShapeDot.x) + (clickedDot.x - extremeDot.x) * (extremeDot.y - firstShapeDot.y)) / det;
    gamma = ((firstShapeDot.y - secondShapeDot.y) * (extremeDot.x - firstShapeDot.x) + (secondShapeDot.x - firstShapeDot.x) * (extremeDot.y - firstShapeDot.y)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}

/**
 * @param {Vector} dot
 * @param {Array<Vector>} dots
 * @returns {boolean}
 */
function checkIntersection(dot, dots) {
  const extreme = createVector(Number.MAX_SAFE_INTEGER, dot.y);

  let count = intersects(dots[0], dots[dots.length - 1], dot, extreme) ? 1 : 0;

  for (let i = 0; i < dots.length - 1; i++) {
    if (intersects(dots[i], dots[i + 1], dot, extreme)) {
      count++;
    }
  }

  return count % 2 === 1;
}

/**
 * @param {Shape} shape
 * @param {Vector} dot
 */
function checkDotInsideShape(shape, dot) {

  if (shape.type === 'circle') {
    const center = shape.dots[0];
    return Math.sqrt((dot.x - center.x) * (dot.x - center.x) + (dot.y - center.y) * (dot.y - center.y)) < p5.Vector.dist(center, shape.dots[1]);
  } else if (shape.type === 'line') {

    const [first, second] = shape.dots;

    const tolerance = 5;

    return checkIntersection(dot, [
      createVector(first.x - tolerance, first.y - tolerance),
      createVector(first.x - tolerance, first.y + tolerance),
      createVector(second.x + tolerance, second.y - tolerance),
      createVector(second.x + tolerance, second.y + tolerance),
    ])
  }
  return checkIntersection(dot, shape.dots);
}
