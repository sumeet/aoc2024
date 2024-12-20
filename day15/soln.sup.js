function part1(input) {
  let [grid, instructions] = input.trim().split('\n\n');
  grid = grid.split('\n').map(l => l.split(''));
  instructions = instructions.replaceAll('\n', '');
  map = {};
  let playerPos = [0, 0];
  for (const [y, line] of grid.entries()) {
    for (const [x, c] of line.entries()) {
      if (c === '@') {
        playerPos = [y, x];
        map[[y, x]] = '.';
      } else {
        map[[y, x]] = c;
      }
    }
  }

  outer: for (const instr of instructions) {
    let dir;
    switch (instr) {
      case '^':
        dir = [-1, 0];
        break;
      case '>':
        dir = [0, 1];
        break;
      case 'v':
        dir = [1, 0];
        break;
      case '<':
        dir = [0, -1];
        break;
      default:
        throw new Error(`Invalid instruction: ${instr}`);
    }

    const stack = [];
    let nextPos = playerPos;
    inner: while (true) {
      nextPos = [nextPos[0] + dir[0], nextPos[1] + dir[1]];
      switch (map[nextPos]) {
        case '#': continue outer;
        case '.': 
          stack.push(nextPos);
          break inner;
        case 'O':
          stack.push(nextPos);
          continue inner; 
        default:
          throw new Error(`Invalid grid item: ${map[nextPos]}`);
      }
    }
    if (stack.length === 0) continue;
    while (stack.length > 1) {
      let next = stack.pop();
      let prev = [next[0] - dir[0], next[1] - dir[1]];
      map[prev] = '.';
      map[next] = 'O';
    }
    playerPos = stack.pop();

    //for (let y = 0; y < grid.length; y++) {
    //  let line = '';
    //  for (let x = 0; x < grid[y].length; x++) {
    //    if (playerPos[0] === y && playerPos[1] === x) {
    //      line += '@';
    //    } else {
    //      line += map[[y, x]];
    //    }
    //  }
    //  console.log(line);
    //}
  }

  let total = 0;
  for (const [coord, c] of Object.entries(map)) {
    if (c === 'O') {
      const [y, x] = coord.split(',').map(Number);
      total += 100 * y + x;
    }
  }
  return total;
}

function part2(input) {
  let [grid, instructions] = input.trim().split('\n\n');
  grid = grid.replaceAll('#', '##').replaceAll('O', '[]').replaceAll('.', '..').replaceAll('@', '@.');

  //console.log('initial grid');
  //console.log('--------------');
  //console.log(grid);

  grid = grid.split('\n').map(l => l.split(''));
  instructions = instructions.replaceAll('\n', '');
  map = {};
  let playerPos = [0, 0];
  for (const [y, line] of grid.entries()) {
    for (const [x, c] of line.entries()) {
      if (c === '@') {
        playerPos = [y, x];
        map[[y, x]] = '.';
      } else {
        map[[y, x]] = c;
      }
    }
  }

  instructionLoop: for (const instr of instructions) {
    let dir;
    switch (instr) {
      case '^':
        dir = [-1, 0];
        break;
      case '>':
        dir = [0, 1];
        break;
      case 'v':
        dir = [1, 0];
        break;
      case '<':
        dir = [0, -1];
        break;
      default:
        throw new Error(`Invalid instruction: ${instr}`);
    }

    //console.log('dir:', instr);
    //console.log('---------------------');

    const workStack = [];
    //let nextPos = playerPos;
    const searchStack = [playerPos];
    const searchSeen = new Set();
    searchLoop: while (searchStack.length > 0) {
      let nextPos = searchStack.pop();
      if (searchSeen.has(String(nextPos))) continue;
      searchSeen.add(String(nextPos));
      nextPos = [nextPos[0] + dir[0], nextPos[1] + dir[1]];
      switch (map[nextPos]) {
        case '#': continue instructionLoop;
        case '.': 
          workStack.push(nextPos);
          continue searchLoop;
        case '[':
          workStack.push(nextPos);
          searchStack.push([nextPos[0], nextPos[1] + 1]);
          searchStack.push(nextPos);
          continue searchLoop;
        case ']':
          workStack.push(nextPos);
          searchStack.push([nextPos[0], nextPos[1] - 1]);
          searchStack.push(nextPos);
          continue searchLoop; 
        default:
          throw new Error(`Invalid grid item: ${map[nextPos]}`);
      }
    }
    if (workStack.length === 0) continue;

    workStack.sort(([ay, ax], [by, bx]) => {
      // the sort depends on the direction
      if (dir[0] === 1) {
        return ay - by;
      } else if (dir[0] === -1) {
        return by - ay;
      } else if (dir[1] === 1) {
        return ax - bx;
      }
      return bx - ax;
    });

    while (workStack.length > 1) {
      //console.log('workStack', workStack);
      let next = workStack.pop();
      let prev = [next[0] - dir[0], next[1] - dir[1]];
      let prevCell = map[prev];
      map[prev] = '.';
      map[next] = prevCell;
      //printGrid(grid, playerPos);
    }
    playerPos = workStack.pop();

    //console.log('--done--');
    //printGrid(grid, playerPos);
  }

  let total = 0;
  for (const [coord, c] of Object.entries(map)) {
    if (c === '[') {
      const [y, x] = coord.split(',').map(Number);
      total += 100 * y + x;
    }
  }
  return total;
}

function printGrid(grid, playerPos) {
  for (let y = 0; y < grid.length; y++) {
    let line = '';
    for (let x = 0; x < grid[y].length; x++) {
      if (playerPos[0] === y && playerPos[1] === x) {
        line += '@';
      } else {
        line += map[[y, x]];
      }
    }
    console.log(line);
  }
}

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
//const input = fs.readFileSync('sample-large.txt', 'utf8');
//const input = fs.readFileSync('sample2.txt', 'utf8');
//const input = fs.readFileSync('custom.txt', 'utf8');

//console.log(part1(input));
console.log(part2(input));
