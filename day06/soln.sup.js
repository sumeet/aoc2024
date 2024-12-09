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
  function cacheKey(pos, dir) { return `${pos}|${dir}`; }
  function search(grid, pos) {
    let dir = [-1, 0];
    const visited = new Set();
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
      if (visited.has(cacheKey(pos, dir))) return 'LOOP';
      visited.add(cacheKey(pos, dir));
    }
    return visited;
  }
  const initGrid = input.trim().split("\n").map(line => line.split(""));
  let initPos;
  for (let y = 0; y < initGrid.length; y++) {
    for (let x = 0; x < initGrid[y].length; x++) {
      if (initGrid[y][x] === "^") initPos = [y, x];
    }
  }
  let visited = search(clone(initGrid), clone(initPos));
  visited = [...new Set([...visited].map(v => v.split("|")[0]))];
  let count = 0;
  for (const [y, x] of visited.map(v => v.split(',').map(Number))) {
    const grid = clone(initGrid);
    if (grid[y][x] === '^') continue;
    if (grid[y][x] === '#') throw new Error("visited a #, shouldn't happen");
    grid[y][x] = '#';
    if (search(clone(grid), clone(initPos)) === 'LOOP') {
      count++;
    }
  }
  return count;
}

function oob(grid, pos) {
  return pos[0] < 0 || pos[1] < 0 || pos[0] >= grid.length ||
    pos[1] >= grid[0].length;
}

function rot90(dir) { return [dir[1], -dir[0]]; }

function clone(o) { return JSON.parse(JSON.stringify(o)); }

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
//const input = fs.readFileSync('sample.txt', 'utf8');
console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));

