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
    const stack = [found];
    let perimeter = [];
    let area = 0;
    while (stack.length > 0) {
      const [y, x, dirId] = stack.pop();
      if (seen.has(String([y, x]))) continue;
      const cell = grid?.[y]?.[x];
      if (cell !== region) {
        perimeter.push([y, x, dirId]);
      } else {
        grid[y][x] = '.';
        area++;
        for (const [dirId, [dy, dx]] of dirs.entries()) {
          stack.push([y+dy, x+dx, dirId]);
        }
        seen.add(String([y, x]));
      }
    }

    let sides = 0;
    while (perimeter.length > 0) {
      const [y, x, dirId] = perimeter.pop();

      // y
      let next = [];
      let side = [x];
      for (const [ry, rx, rdirId] of perimeter) {
        if (rdirId === dirId && ry === y) side.push(rx);
        else next.push([ry, rx, rdirId]);
      }
      if (side.length > 1) {
        side.sort();
        let prev = undefined;
        for (const s of side) {
          if (s !== prev + 1) sides++;
          prev = s;
        }
        perimeter = next;
        continue;
      }

      // x
      next = [];
      side = [y];
      for (const [ry, rx, rdirId] of perimeter) {
        if (rdirId === dirId && rx === x) side.push(ry);
        else next.push([ry, rx, rdirId]);
      }
      side.sort();
      prev = undefined;
      for (const s of side) {
        if (s !== prev + 1) sides++;
        prev = s;
      }

      perimeter = next;
    }

    console.log(region, 'area', area, 'sides', sides);
    total += area * sides;
  }
  return total;
}

const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const fs = require('fs');
const input = fs.readFileSync('sample.txt', 'utf-8').trim();
//const input = fs.readFileSync('input.txt', 'utf-8').trim();

console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
