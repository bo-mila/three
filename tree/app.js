import { makeTree } from "../buildTree.js";
import { drawTree } from "./draw.js";
import { beginGrowth } from "../grow.js";
import { rnd } from "../math.js";

const branchingTotalAngle = Math.PI * 2 / 6;
const treeProperties = {
  x: 450,
  y: 750,
  branchNumber: 2, 
  length: 180,
  branchingLength: 0.9,
  width: 94,
  branchingWidth: 0.5,
  branchingTotalAngle: branchingTotalAngle, 
  maxCurvature: 0.1, 
  iteration: 4,
};

const growth = {
  maxLength: 150,
  branchingLength: 25,
  branchingCount: 3,
  branchingTotalAngle: Math.PI * 2 / 3 + rnd(-1, 1),
  maxBranchDepth: 2,
  maxLengthRatio: 0.7,
  speed: 0.01,
};

const tree = makeTree(treeProperties);
console.log(tree);
drawTree(tree);

// beginGrowth(tree, growth, 50000);