function part1(input) {
  let [grid, map, start, end] = parse(input);
  const track = run(map, start, end);
  return solve(track, 2);
}

function part2(input) {
  let [grid, map, start, end] = parse(input);
  const track = run(map, start, end);
  return solve(track, 20);
}

function solve(track, cheatLength) {
  const WANT_CHEAT = 100;
  let total = 0;
  for (const [i, move] of track.entries()) {
    for (let [j, next] of track.slice(i+WANT_CHEAT).entries()) {
      const dist = manhattanDistance(move, next);
      if (dist <= cheatLength) {
        const stepsSaved = j + WANT_CHEAT - dist;
        if (stepsSaved >= WANT_CHEAT) total++;
      }
    }
  }
  return total;
}

function run(map, start, end) {
  let pos = start;
  let prev = pos;
  let path = [];
  outer: while (String(pos) !== String(end)) {
    for (let dir of DIRS) {
      const newPos = [pos[0] + dir[0], pos[1] + dir[1]];
      if (String(prev) === String(newPos)) continue;
      if (map[newPos] === '.') {
        path.push(pos);
        prev = pos;
        pos = newPos;
        continue outer;
      }
    }
    throw new Error("got stuck");
  }
  path.push(pos);
  return path;
}

function parse(input) {
  const grid = input.trim().split('\n').map(row => row.split(''));
  let start;
  let end;
  let map = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 'S') {
        map[[i, j]] = '.';
        start = [i, j];
      } else if (grid[i][j] === 'E') {
        map[[i, j]] = '.';
        end = [i, j];
      } else {
        map[[i, j]] = grid[i][j];
      }
    }
  }
  return [grid, map, start, end];
}

const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function manhattanDistance([ay, ax], [by, bx]) {
  return Math.abs(ay - by) + Math.abs(ax - bx);
}

// this was my original part 1, which is too slow to run on sup and doesn't work for part2
// but without this, i wouldn't have been able to come up with the actual solution

// function part1(input) {
//   let [grid, map, start, end] = parse(input);
//   const uncheatedMoves = run(map, start, end);
//   let total = 0;
//   for (const [i, move] of uncheatedMoves.entries()) {
//     for (const dir1 of dirs) {
//       const newPos1 = [move[0] + dir1[0], move[1] + dir1[1]];
//       if (grid[newPos1[0]][newPos1[1]] !== '#') continue;
//       for (const dir2 of dirs) {
//         const newPos2 = [newPos1[0] + dir2[0], newPos1[1] + dir2[1]];
//         const found = uncheatedMoves.findIndex(pos => String(pos) === String(newPos2));
//         if (found <= i+2) continue;
//         const cheat = [newPos1, newPos2];
//         let timeSaved = found - (i+2);
//         if (timeSaved >= 100) total++;
//       }
//     }
//   }
//   return total;
// }

const fs = require('fs');
//const input = fs.readFileSync('sample.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');


console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
