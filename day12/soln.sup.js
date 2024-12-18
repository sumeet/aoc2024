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
    while (stack.length > 0) {
      const [y, x, dirId] = stack.pop();
      if (seen.has(String([y, x]))) continue;
      const cell = grid?.[y]?.[x];
      if (cell !== region) {
        const [dy, dx, edges] = dirs[dirId];
        const [origY, origX] = [y - dy, x - dx];
        const [a, b] = edges.map(([edy, edx]) => [origY + edy, origX + edx]);
        perimeter.add([a, b]);
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
    let sides = 0;
    for (const start of perimeter.allEdges) {
      if (seen.has(String(start)) || seen.has(String([start[1], start[0]]))) continue;
      console.log('region', region, 'start', start);

      let [pdy, pdx] = [start[1][0] - start[0][0], start[1][1] - start[0][1]];
      seen.add(String(start));
      let next = start;
      while (true) {
        const [a, b] = next;
        const [na, nb] = perimeter.follow(next);
        console.log(`(${a.join(',')}) -> (${b.join(',')}) => (${na.join(',')}) -> (${nb.join(',')})`);
        let [dy, dx] = [nb[0] - na[0], nb[1] - na[1]];
        if (dy !== pdy || dx !== pdx) {
          console.log('---- TURN');
          sides++;
        }
        [pdy, pdx] = [dy, dx];
        next = [na, nb];
        if (seen.has(String(next))) break;
        seen.add(String(next));
      }
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
  follow([a, b]) {
    let filtered = this.map[b].filter(c => String(c) !== String(a));
    if (filtered.length > 1) {
      // pick the one that's turning clockwise
      const c = filtered.find(c => {
        const [dy, dx] = [c[0] - b[0], c[1] - b[1]];
        const [pdy, pdx] = [a[0] - b[0], a[1] - b[1]];
        return dy * pdx - dx * pdy > 0;
      });
      if (c) return [b, c];
      console.log('--------------- from', [a, b], 'to', filtered);
      throw new Error(`found 2 places to go need to pick1`);
    }
    return [b, this.map[b].find(c => String(c) !== String(a))];
  }
  get empty() { return Object.keys(this.map).length === 0; }
  get allEdges() {
    const seen = new Set();
    const edges = [];
    for (let [a, bs] of Object.entries(this.map)) {
      a = a.split(',').map(Number);
      for (const b of bs) {
        if (seen.has(String([a, b])) || seen.has(String([b, a]))) continue;
        edges.push([a, b]);
        seen.add(String([a, b]));
      }
    }
    return edges;
  }
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
const input = fs.readFileSync('input.txt', 'utf-8').trim();
//const input = fs.readFileSync('sample.txt', 'utf-8').trim();
//
//const input = "AAAA";

//console.log('part 1');
//console.log(part1(input));
//console.log('part 2');
console.log(part2(input));
