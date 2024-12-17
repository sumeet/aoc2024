function part1(input) {
  const groups = input.trim().split("\n\n");
  let sum = 0;
  for (const group of groups) {
    const lines = group.split("\n");
    const [ax, ay] = lines[0].matchAll(/\d+/g).map(Number);
    const [bx, by] = lines[1].matchAll(/\d+/g).map(Number);
    const [targetX, targetY] = lines[2].matchAll(/\d+/g).map(Number);

    const valid = [];
    for (let a = 0; a <= 100; a++) {
      for (let b = 0; b <= 100; b++) {
        if ((ax*a + bx*b) === targetX && (ay*a + by*b) === targetY) {
          valid.push(3*a + b);
        }
      }
    }
    if (valid.length > 0) {
      sum += Math.min(...valid);
    }
  }
  return sum;
}

function part2(input) {
  const groups = input.trim().split("\n\n");
  let sum = 0;
  for (const group of groups) {
    const lines = group.split("\n");
    const [ax, ay] = lines[0].matchAll(/\d+/g).map(Number);
    const [bx, by] = lines[1].matchAll(/\d+/g).map(Number);
    let [targetX, targetY] = lines[2].matchAll(/\d+/g).map(Number);
    targetX += 10000000000000;
    targetY += 10000000000000;

    const got = [];
    console.log('first loop');
    for (let a = 0; got.length !== 2 && a !== 10000; a++) {
      let aProdX = ax*a;
      let xDiff = targetX - aProdX;
      if (xDiff % bx !== 0) continue;
      let bFactorX = xDiff / bx;
      let aProdY = ay*a;
      let yDiff = targetY - aProdY;
      if (yDiff % by !== 0) continue;
      let bFactorY = yDiff / by;
      got.push(a);
    }

    console.log(got, got[1] - got[0]);

    console.log('second loop');
    const valid = [];
    for (let a = got[0]; ax*a <= targetX; a += got[1] - got[0]) {
      let aProdX = ax*a;
      let xDiff = targetX - aProdX;
      if (xDiff % bx !== 0) continue;
      let bFactorX = xDiff / bx;

      let aProdY = ay*a;
      let yDiff = targetY - aProdY;
      if (yDiff % by !== 0) continue;
      let bFactorY = yDiff / by;

      if (bFactorX === bFactorY) {
        valid.push(3*a + bFactorX);
        break;
      }

    }
    if (valid.length > 0) {
      sum += Math.min(...valid);
    }
  }
  return sum;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}


const fs = require('fs');
//const input = fs.readFileSync('input.txt', 'utf8');
const input = fs.readFileSync('input.txt', 'utf8');
//console.log(part1(input));
console.log(part2(input));
