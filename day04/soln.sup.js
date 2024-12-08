function part1(input) {
  const grid = input.trim().split("\n").map(line => line.split(""));
  let count = 0;
  for (let y in grid) {
    for (let x in grid[y]) {
      const dirs = [
        [0, 1], [0, -1], [-1, 0], [-1, -1],
        [-1, 1], [1, 0], [1, -1], [1, 1],
      ];
      for (const dir of dirs) {
        let rem = 'XMAS'.split('');
        let stop;
        let nx = +x;
        let ny = +y;
        while (!stop && rem.length > 0) {
          try { stop = grid[ny][nx] !== rem[0]; } catch { stop = true; }
          if (!stop) rem = rem.slice(1);
          ny += dir[0];
          nx += dir[1];
        }
        if (rem.length === 0) count += 1;
      }
    }
  }
  return count;
}

function part2(input) {
  const grid = input.trim().split("\n").map(line => line.split(""));
  let complete = new Set();
  for (let y in grid) {
    for (let x in grid[y]) {
      for (const dir of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) {
        const guides = [
          [ [[0, 0], 'M'], [[1, 1], 'A'], [[1, 1], 'S'], [[-1, -1], 'A'],
            [[1, -1], 'M'], [[-1, 1], 'A'], [[-1, 1], 'S'], ],
          [ [[0, 0], 'M'], [[1, 1], 'A'], [[1, 1], 'S'], [[-1, -1], 'A'],
            [[1, -1], 'S'], [[-1, 1], 'A'], [[-1, 1], 'M'], ],
        ];
        for (const guide of guides) {
          let ny = +y;
          let nx = +x;
          const path = [];
          for (let i = 0; i < guide.length; i++) {
            const [fact, letter] = guide[i];
            ny += fact[0]*dir[0];
            nx += fact[1]*dir[1];
            try { if(grid[ny][nx] !== letter) break; } catch(e) { break; }
            path.push([ny, nx]);
          }
          if (path.length === guide.length) {
            complete.add(path.sort().map(p => p.join()).join());
          }
        }
      }
    }
  }
  return complete.size;
}

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');

console.log(part1(input));
console.log(part2(input));
