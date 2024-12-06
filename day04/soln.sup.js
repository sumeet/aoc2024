function part1(input) {
  const grid = input.trim().split("\n").map(line => line.split(""));
  let count = 0;

  function dfs(rem, pos, visited) {
    if (visited.has(pos.join(','))) return;
    visited.add(pos.join(','));

    let item;
    try { item = grid[pos[1]][pos[0]]; } catch(e) { return; }
    if (item !== rem[0]) return;

    rem = rem.slice(1);
    if (rem.length === 0) {
      count += 1;
      console.log('done', visited);
      return;
    }

    for (const dir of dirs) {
      dfs(rem, [pos[1]+dir[1], pos[0]+dir[0]], new Set(visited));
    }
  }

  for (const y in grid) {
    for (const x in grid[y]) {
      dfs('XMAS'.split(''), [+y, +x], new Set());
    }
  }

  return count;
}

const dirs = [
  [0, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [1, 0],
  [1, -1],
  [1, 1],
];


const fs = require('fs');
//const input = fs.readFileSync('input.txt', 'utf-8');
const input = fs.readFileSync('sample.txt', 'utf-8');

console.log(part1(input));
