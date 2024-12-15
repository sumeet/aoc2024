function part1(input) {
  const grid = input.trim().split("\n").map(l => l.split(""));
  let total = 0;
  while (true) {
    let found = undefined;
    let region = undefined;

    outer: for (const [y, row] of grid.entries()) {
      for (const [x, cell] of row.entries()) {
        if (cell !== '.') {
          found = [y, x];
          region = cell;
          break outer;
        }
      }
    }
    if (!found) break;
    const seen = new Set();
    const stack = [found];
    let perimeter = 0;
    let area = 0;
    while (stack.length > 0) {
      const [y, x] = stack.pop();
      if (seen.has(String([y, x]))) continue;
      const cell = grid?.[y]?.[x];
      if (cell !== region) {
        perimeter++;
      } else {
        grid[y][x] = '.';
        area++;
        for (const [dy, dx] of dirs) {
          stack.push([y+dy, x+dx]);
        }
        seen.add(String([y, x]));
      }
    }
    total += area * perimeter;
  }
  return total;
}

function part2(input) {
  const grid = input.trim().split("\n").map(l => l.split(""));
  let total = 0;
  while (true) {
    let found = undefined;
    let region = undefined;

    outer: for (const [y, row] of grid.entries()) {
      for (const [x, cell] of row.entries()) {
        if (cell !== '.') {
          found = [y, x];
          region = cell;
          break outer;
        }
      }
    }
    if (!found) break;
    const seen = new Set();
    let stack = [found];
    let perimeter = new Bigraph;
    let area = 0;
    let start = undefined;
    while (stack.length > 0) {
      const [y, x, dirId] = stack.pop();
      if (seen.has(String([y, x]))) continue;
      const cell = grid?.[y]?.[x];
      if (cell !== region) {
        const [dy, dx, edges] = dirs[dirId];
        const [origY, origX] = [y - dy, x - dx];
        const [a, b] = edges.map(([edy, edx]) => [origY + edy, origX + edx]);
        perimeter.add([a, b]);
        start = [a, b];
      } else {
        grid[y][x] = '.';
        area++;
        for (const [dirId, [dy, dx]] of dirs.entries()) {
          stack.push([y+dy, x+dx, dirId]);
        }
        seen.add(String([y, x]));
      }
    }

    seen.clear();
    stack = [];
    let sides = 0;
    let [pdy, pdx] = [start[1][0] - start[0][0], start[1][1] - start[0][1]];
    seen.add(String(start));
    while (true) {
      const [a, b] = start;
      const [na, nb] = perimeter.follow(start);
      let [dy, dx] = [nb[0] - na[0], nb[1] - na[1]];
      if (dy !== pdy || dx !== pdx) {
        sides++;
      }
      [pdy, pdx] = [dy, dx];
      start = [na, nb];
      if (seen.has(String(start))) break;
      seen.add(String(start));
    }

    console.log(region, 'area', area, 'sides', sides);
    total += area * sides;
  }
  return total;
}

class Bigraph {
  constructor() { this.map = {}; }
  add([a, b]) {
    (this.map[a] ||= []).push(b);
    (this.map[b] ||= []).push(a);
  }
  follow([a, b]) { return [b, this.map[b].find(c => String(c) !== String(a))]; }
  get empty() { return Object.keys(this.map).length === 0; }
}

// corner      corner
// [0,0]  UP   [0,1]
//    +------------+
//  L |            | R
//  E |    cell    | I     
//  F |    (0,0)   | G
//  T |            | H
//    |            | T
//    +------------+
// [1,0]   DOWN   [1,1]
// corner      corner

const dirs = [ // y, x
  // DOWN
  [1, 0, [[1, 0], [1, 1]]],
  // RIGHT
  [0, 1, [[0, 1], [1, 1]]],
  // UP
  [-1, 0, [[0, 0], [0, 1]]],
  // LEFT
  [0, -1, [[0, 0], [1, 0]]],
];

const fs = require('fs');
const input = fs.readFileSync('sample.txt', 'utf-8').trim();
//const input = fs.readFileSync('input.txt', 'utf-8').trim();
//
//const input = "AAAA";

//console.log('part 1');
//console.log(part1(input));
//console.log('part 2');
console.log(part2(input));
