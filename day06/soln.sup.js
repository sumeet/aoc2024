function part1(input) {
  const grid = input.trim().split("\n").map(line => line.split(""));
  let pos;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") pos = [y, x];
    }
  }
  const visited = new Set();
  let dir = [-1, 0];
  while (true) {
    pos[0] += dir[0];
    pos[1] += dir[1];
    if (oob(grid, pos)) { break; }
    if (grid[pos[0]][pos[1]] === "#") {
      pos[0] -= dir[0];
      pos[1] -= dir[1];
      dir = rot90(dir);
      pos[0] += dir[0];
      pos[1] += dir[1];
    }
    visited.add(pos.join(','));
    grid[pos[0]][pos[1]] = 'X';
  }
  return visited.size;
}

function part2(input) {
  const acc = new Set();
  function search(grid, pos, dir, depth) {
    let count = 0;
    const visited = {};
    while (true) {
      (visited[pos] ||= []).push(String(dir));
      pos[0] += dir[0];
      pos[1] += dir[1];
      if (depth > 0 && (visited[pos] || []).includes(String(dir))) return 1;
      if (oob(grid, pos)) { break; }
      if (grid[pos[0]][pos[1]] === "#") {
        pos[0] -= dir[0];
        pos[1] -= dir[1];
        dir = rot90(dir);
        pos[0] += dir[0];
        pos[1] += dir[1];
      } else if (depth === 0) {
        const hypoPos = pos.slice();
        hypoPos[0] -= dir[0];
        hypoPos[1] -= dir[1];
        const hypoDir = rot90(dir);
        hypoPos[0] += hypoDir[0];
        hypoPos[1] += hypoDir[1];
        const grid2 = JSON.parse(JSON.stringify(grid));
        grid2[pos[0]][pos[1]] = '#'
        let res;
        if ((res = search(grid2, hypoPos, hypoDir, depth+1)) > 0) {
          acc.add(String(pos));
          count += res;
        }
      }
    }
    return count;
  }
  const initGrid = input.trim().split("\n").map(line => line.split(""));
  let startingPos;
  for (let y = 0; y < initGrid.length; y++) {
    for (let x = 0; x < initGrid[y].length; x++) {
      if (initGrid[y][x] === "^") startingPos = [y, x];
    }
  }
  const ret = search(initGrid, startingPos, [-1, 0], {}, 0);
  //console.log(initGrid.map(l => l.join("")).join("\n"));
  return acc.size;
  //return ret;
}

function oob(grid, pos) {
  return pos[0] < 0 || pos[1] < 0 || pos[0] >= grid.length ||
    pos[1] >= grid[0].length;
}

function rot90(dir) {
  if (dir[0] === -1 && dir[1] === 0) return [0, 1]; // up -> right
  if (dir[0] === 0 && dir[1] === 1) return [1, 0]; // right -> down
  if (dir[0] === 1 && dir[1] === 0) return [0, -1]; // down -> left
  return [-1, 0];// left -> up
}

const fs = require('fs');
//const input = fs.readFileSync('input.txt', 'utf8');
const input = fs.readFileSync('input.txt', 'utf8');
console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
