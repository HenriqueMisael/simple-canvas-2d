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
