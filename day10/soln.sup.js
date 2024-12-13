function part1(input) {
  const grid = input.trim().split("\n").map(line => line.split("").map(Number));
  const startingPoses = [];
  for (const [y, row] of grid.entries()) {
    for (const [x, num] of row.entries()) {
      if (num === 0) startingPoses.push([y, x]);
    }
  }
  function score(pos, prev) {
    let cell;
    try { cell = grid[pos[0]][pos[1]] } catch { return new Set(); }
    if (cell !== prev + 1) return new Set();
    if (cell === 9) return new Set([String(pos)]);
    let acc = new Set();
    for (const dir of dirs) {
      acc = acc.union(score([dir[0]+pos[0], dir[1]+pos[1]], cell));
    }
    return acc;
  }
  let total = 0;
  for (const pos of startingPoses) total += score(pos, -1, new Set()).size;
  return total;
}

function part2(input) {
  const grid = input.trim().split("\n").map(line => line.split("").map(Number));
  const startingPoses = [];
  for (const [y, row] of grid.entries()) {
    for (const [x, num] of row.entries()) {
      if (num === 0) startingPoses.push([y, x]);
    }
  }
  function score(pos, prev) {
    let cell;
    try { cell = grid[pos[0]][pos[1]] } catch { return 0; }
    if (cell !== prev + 1) return 0;
    if (cell === 9) return 1;
    let total = 0;
    for (const dir of dirs) {
      total += score([dir[0]+pos[0], dir[1]+pos[1]], cell);
    }
    return total;
  }
  return startingPoses.map(pos => score(pos, -1)).reduce((x,y) => x+y);
}

const dirs = [[0, 1], [0, -1], [-1, 0], [1, 0]];

const fs = require('fs');
//const input = fs.readFileSync('input.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');

console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
