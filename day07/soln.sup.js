function part1(input) {
  let sum = 0;
  outer: for (const line of input.trim().split("\n")) {
    let [left, right] = line.trim().split(": ");
    left = Number(left);
    right = right.split(" ").map(Number);
    let numOperators = right.length - 1;
    for (let opPattern = 0; opPattern < 1 << numOperators; opPattern++) {
      let total = right[0];
      for (let i = 0; i < numOperators; i++) {
        if (opPattern & (1 << i)) {
          total *= right[i+1];
        } else {
          total += right[i+1];
        }
      }
      if (total === left) {
        sum += total;
        continue outer;
      }
    }
  }
  return sum;
}

function part2(input) {
  let sum = 0;
  outer: for (const line of input.trim().split("\n")) {
    let [left, right] = line.trim().split(": ");
    left = Number(left);
    right = right.split(" ").map(Number);
    let numOperators = right.length - 1;
    for (let opPattern = 0; opPattern < 3 ** numOperators; opPattern++) {
      let total = right[0];
      let pattern = opPattern;
      for (let i = 0; i < numOperators; i++) {
        switch (pattern % 3) {
          case 0: total *= right[i+1]; break;
          case 1: total += right[i+1]; break;
          case 2: total = Number(String(total) + String(right[i+1])); break;
        }
        pattern = Math.floor(pattern / 3);
      }
      if (total === left) {
        sum += total;
        continue outer;
      }
    }
  }
  return sum;
}


const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
//const input = fs.readFileSync('sample.txt', 'utf-8');
console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
