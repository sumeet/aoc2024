function part1(input) {
  const grid = input.trim().split("\n").map(line => line.split(""));
  let pos;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") pos = [y, x];
    }
  }
  let visited = search(grid, pos);
  visited = new Set([...visited].map(v => v.split("|")[0]));
  return visited.size;
}


function part2(input) {
  const grid = input.trim().split("\n").map(line => line.split(""));
  let pos;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") pos = [y, x];
    }
  }
  let visited = search(grid, pos);
  visited = new Set([...visited].map(v => v.split("|")[0]));
  visited = [...visited];
  let count = 0;
  for (const [y, x] of visited.map(v => v.split(',').map(Number))) {
    if (grid[y][x] === '^') continue;
    grid[y][x] = '#';
    if (search(grid, pos) === 'LOOP') count++;
    grid[y][x] = '.';
  }
  return count;
}

function cacheKey(pos, dir) { return `${pos}|${dir}`; }
function search(grid, pos) {
  let dir = [-1, 0];
  const visited = new Set();
  while (true) {
    const nextPos = [pos[0] + dir[0], pos[1] + dir[1]];
    if (oob(grid, nextPos)) { break; }
    if (grid[nextPos[0]][nextPos[1]] === "#") {
      dir = [dir[1], -dir[0]]; // rotate 90 degrees
    } else {
      pos = nextPos;
    }
    if (visited.has(cacheKey(pos, dir))) return 'LOOP';
    visited.add(cacheKey(pos, dir));
  }
  return visited;
}


function oob(grid, pos) {
  return pos[0] < 0 || pos[1] < 0 || pos[0] >= grid.length ||
    pos[1] >= grid[0].length;
}

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
//const input = fs.readFileSync('sample.txt', 'utf8');
console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));

