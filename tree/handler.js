import { POINT_SIZE, structureTree } from "./app.js";
import { drawPoint, clear } from "../canvas.js";
import { prepareTree } from "./buildTree.js";
import { drawTree } from "./draw.js";
import { getAngle } from '../geometry.js';
import { getEndXY } from '../geometry.js';

let activePoint = null;
let activeBranch = null;
let points = null;

canvas.onmousedown = (e) => {
  if (activePoint) {
    activePoint.active = false;
    activePoint = null;
  }
  const point = findPoint(e.layerX, e.layerY, points);
  if (point) {
    point.active = true;
    activePoint = point;
    findBrunch(activePoint.id);
  }

  clear();
  render();
}

canvas.onmousemove = (e) => {
  if (activeBranch && activePoint) {
    moveBranch({x: e.layerX, y: e.layerY});

    clear();
    render();
  }
}

canvas.onmouseup = (e) => {
  if (activePoint) {
    activePoint.active = false;
    activePoint = null;
  }
  if (activeBranch) {
    activeBranch = null;
  }

  clear();
  render();
}

function movePoint(point, {x, y}) {
  // if (point.type === "normal" || !point.type) {
  //   const normalPoints = point.shape.points.filter((point) => point.type === "normal" || !point.type);
  //   if (normalPoints.length === 1) {
  //     const pointsToMove = point.shape.points.filter((point) => !normalPoints.includes(point));
  //     const deltaX = x - point.x;
  //     const deltaY = y - point.y;
  //     pointsToMove.forEach((point) => {
  //       point.x += deltaX;
  //       point.y += deltaY;
  //     })
  //   }
  // }
  point.x = x;
  point.y = y;
}

function findPoint(x, y, points) {
  return points.find((point) => {
    const distance = Math.hypot(point.x - x, point.y - y);
    return distance < POINT_SIZE / 2;
  }) || null;
}

function render() {
  const tree = prepareTree(structureTree);
  drawTree(tree);

  points = getTreePoints(structureTree);
  points.forEach(point => {
    drawPoint({ point: point, pointSize: POINT_SIZE, pointColors: "red"});
  });
}

function moveBranch(coord) {
  const angle = activeBranch.angle - getAngle(activeBranch.x,  activeBranch.y, coord.x, coord.y);
  activeBranch.angle -= angle;
  moveChildrenBranch(angle);
}

function moveChildrenBranch(angle, branch = activeBranch) {
  const { x, y } = getEndXY(branch.x, branch.y, branch.length, branch.angle );
  if (branch.branches.length !== 0) {
    for (let i = 0; i < branch.branches.length; i++) {
      const children = branch.branches[i];
      children.x = x;
      children.y = y;
      children.angle -= angle;

      if (children.branches.length !== 0) {
        moveChildrenBranch(angle, children);
      } else {
        const { x: endX, y: endY } = getEndXY(children.x, children.y, children.length, children.angle );
        children.endX = endX;
        children.endY = endY;
      }
    }
  } else {
    branch.endX = x;
    branch.endY = y;
  }
}

function findBrunch(id, tree = structureTree) {
  for (let i = 0; i < tree.branches.length; i++) {
    const branch = tree.branches[i];
    if (branch.id === id) {
      activeBranch = branch;
      break;
    }
    if (branch.branches.length !== 0) {
      findBrunch(id, branch);
    } 
  }
}

function getTreePoints(structureTree, points = []) {
  //выбираются точки из структуры дерева, и каждой присваивается id родительской ветки
  //это для того, чтобы конечные точки были отнесены к конечной ветке
  // points.push({ x: structureTree.x, y: structureTree.y, id: structureTree.id });

  if (structureTree.branches !== 0) {
    points.push({ x: structureTree.branches[0].x, y: structureTree.branches[0].y, id: structureTree.id });
    points = getBranchesPoints(structureTree, points);
  }
  return points;
};

function getBranchesPoints(tree, points) {
  for (let i = 0; i < tree.branches.length; i++) {
    const branch = tree.branches[i];
    points.push({ x: (branch.branches.length !== 0? branch.branches[0].x : branch.endX), y: (branch.branches.length !== 0? branch.branches[0].y : branch.endY), id: branch.id });
    
    if (branch.branches.length !== 0) {
      getBranchesPoints(branch, points);
    } 
  }
  return points;
}

export { render };