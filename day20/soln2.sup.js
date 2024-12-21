const fs = require('fs');
//const input = fs.readFileSync('sample.txt', 'utf-8').trim();
const input = fs.readFileSync('input.txt', 'utf-8').trim();


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
  let moveCount = 0;
  outer: while (String(pos) !== String(end)) {
    // try cheats first
    for (let dir of dirs) {
      const newPos = [pos[0] + dir[0], pos[1] + dir[1]];
      if (seen.has(String(newPos))) continue;
      if (map[newPos] === 'C') {
        seen.add(String(newPos));
        pos = newPos;
        moveCount++;
        continue outer;
      }
    }

    for (let dir of dirs) {
      const newPos = [pos[0] + dir[0], pos[1] + dir[1]];
      if (seen.has(String(newPos))) continue;
      if (map[newPos] === '.') {
        seen.add(String(newPos));
        pos = newPos;
        moveCount++;
        continue outer;
      }
    }

    // got stuck
    //console.log('got stuck');
    if (String(pos) !== String(end)) return Infinity;
  }
  return moveCount;
}


const uncheated = run(map);
console.log('moveCount', uncheated);

let total = 0;

for (let y = 0; y < grid.length; y++) {
  let row = grid[y];
  console.log(1, 'working through row', y);
  for (let x = 1; x < row.length; x++) {
    if (row[x] === '#' || row[x - 1] === '#') {
      let newMap = {...map, [[y, x]]: 'C', [[y, x - 1]]: 'C'};
      //console.log('trying one');
      const cheated = run(newMap);
      //console.log('cheated', cheated);
      if (uncheated - cheated >= 100) total++;
    }
  }
}

for (let y = 1; y < grid.length; y++) {
  let row = grid[y];
  console.log(2, 'working through row', y);
  for (let x = 0; x < row.length; x++) {
    if (row[x] === '#' || grid[y - 1][x] === '#') {
      let newMap = {...map, [[y, x]]: 'C', [[y-1, x]]: 'C'};
      //console.log('trying one');
      const cheated = run(newMap);
      //console.log('cheated', cheated);
      if (uncheated - cheated >= 100) total++;
    }
  }
}

console.log(total);
