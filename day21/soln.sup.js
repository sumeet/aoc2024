const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8').trim();
//const input = fs.readFileSync('input.txt', 'utf-8').trim();


const grid = input.split('\n').map(row => row.split(''));
//console.log(grid);

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

const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

//console.log('start', start);
//console.log('end', end);
//console.log(map);

function run(map) {
  let pos = start;
  let seen = new Set([String(pos)]);
  let path = [];
  outer: while (String(pos) !== String(end)) {
    // try cheats first
    for (let dir of dirs) {
      const newPos = [pos[0] + dir[0], pos[1] + dir[1]];
      if (seen.has(String(newPos))) continue;
      if (map[newPos] === 'C') {
        seen.add(String(newPos));
        path.push(pos);
        pos = newPos;
        continue outer;
      }
    }

    for (let dir of dirs) {
      const newPos = [pos[0] + dir[0], pos[1] + dir[1]];
      if (seen.has(String(newPos))) continue;
      if (map[newPos] === '.') {
        seen.add(String(newPos));
        path.push(pos);
        pos = newPos;
        continue outer;
      }
    }

    // got stuck
    //console.log('got stuck');
    if (String(pos) !== String(end)) return Infinity;
  }
  path.push(pos);
  return path;
}


const uncheatedMoves = run(map);
//console.log('moves', uncheatedMoves);
//console.log('moveCount', uncheatedMoves.length);

let usedCheats = new Set;
let total = 0;
for (const [i, move] of uncheatedMoves.entries()) {
  for (const dir1 of dirs) {
    const newPos1 = [move[0] + dir1[0], move[1] + dir1[1]];
    if (grid[newPos1[0]][newPos1[1]] !== '#') continue;
    for (const dir2 of dirs) {
      const newPos2 = [newPos1[0] + dir2[0], newPos1[1] + dir2[1]];
      const found = uncheatedMoves.findIndex(pos => String(pos) === String(newPos2));
      if (found <= i+2) continue;
      const cheat = [newPos1, newPos2];
      if (usedCheats.has(String(cheat))) {
        jwiaeofjoiawef;
        continue;
      }
      let timeSaved = found - (i+2);
      if (timeSaved >= 100) total++;
      //console.log(found - (i+2));
    }
  }
}

console.log(total);
//let total = 0;
//
//for (let y = 0; y < grid.length; y++) {
//  let row = grid[y];
//  for (let x = 1; x < row.length; x++) {
//    if (row[x] === '#') {
//      let newMap = {...map, [[y, x]]: 'C', [[y, x - 1]]: 'C'};
//      //console.log('trying one');
//      const cheated = run(newMap);
//      //console.log('cheated', cheated);
//      if (uncheated - cheated >= 100) total++;
//    }
//  }
//}
//
//for (let y = 1; y < grid.length; y++) {
//  let row = grid[y];
//  for (let x = 0; x < row.length; x++) {
//    if (row[x] === '#') {
//      let newMap = {...map, [[y, x]]: 'C', [[y-1, x]]: 'C'};
//      //console.log('trying one');
//      const cheated = run(newMap);
//      //console.log('cheated', cheated);
//      if (uncheated - cheated >= 100) total++;
//    }
//  }
//}

//console.log(total);
