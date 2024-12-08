function part1(input) {
  let [rules, updates] = input.trim().split("\n\n");
  rules = rules.trim().split("\n").map(line => line.split("|").map(Number));
  updates = updates.trim().split("\n").map(line => line.split(",").map(Number));
  let sum = 0;
  outer: for (const update of updates) {
    for (let i = 0; i < update.length; i++) {
      const before = update[i];
      for (let j = i+1; j < update.length; j++) {
        const after = update[j];
        for (const [ruleBefore, ruleAfter] of rules) {
          if (ruleBefore === after && ruleAfter === before) {
            continue outer;
          }
        }
      }
    }
    sum += update[Math.trunc(update.length / 2)];
  }
  return sum;
}

function part2(input) {
  let [rules, updates] = input.trim().split("\n\n");
  rules = rules.trim().split("\n").map(line => line.split("|").map(Number));
  updates = updates.trim().split("\n").map(line => line.split(",").map(Number));
  let sum = 0;
  for (const update of updates) {
    let switched = false;
    iLoop: for (let i = 0; i < update.length; i++) {
      const before = update[i];
      for (let j = i+1; j < update.length; j++) {
        const after = update[j];
        for (const [ruleBefore, ruleAfter] of rules) {
          if (ruleBefore === after && ruleAfter === before) {
            [update[i], update[j]] = [update[j], update[i]];
            switched = true;
            i -= 1;
            continue iLoop;
          }
        }
      }
    }
    if (switched) sum += update[Math.trunc(update.length / 2)];
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
