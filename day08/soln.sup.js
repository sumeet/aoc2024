function part1(input) {
  let lines = input.trim().split('\n');
  let grid = new Set();
  let freqs = {};
  for (const [y, line] of lines.entries()) {
    for (const [x, c] of line.split('').entries()) {
      grid.add(String([y, x]));
      if (c !== '.') (freqs[c] ||= []).push([y, x]);
    }
  }

  let antinodes = new Set();
  for (const poses of Object.values(freqs)) {
    for (const [i, a] of poses.entries()) {
      for (const [j, b] of poses.entries()) {
        if (i === j) continue;
        const diff = a.map((_, i) => a[i] - b[i]);
        const cand = a.map((_, i) => a[i] + diff[i]);
        if (grid.has(String(cand))) antinodes.add(String(cand));
      }
    }
  }
  return antinodes.size;
}

function part2(input) {
  let lines = input.trim().split('\n');
  let grid = new Set();
  let freqs = {};
  for (const [y, line] of lines.entries()) {
    for (const [x, c] of line.split('').entries()) {
      grid.add(String([y, x]));
      if (c !== '.') (freqs[c] ||= []).push([y, x]);
    }
  }

  let antinodes = new Set();
  for (const poses of Object.values(freqs)) {
    for (const [i, a] of poses.entries()) {
      for (const [j, b] of poses.entries()) {
        if (i === j) continue;
        const diff = a.map((_, i) => a[i] - b[i]);
        let cand = a.slice();
        while (grid.has(String(cand))) {
          antinodes.add(String(cand));
          cand = cand.map((_, i) => cand[i] + diff[i]);
        }
      }
    }
  }
  return antinodes.size;
}

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
//const input = fs.readFileSync('sample.txt', 'utf8');
console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
