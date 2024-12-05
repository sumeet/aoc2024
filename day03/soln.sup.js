function part1(input) {
  const mulRe = /mul\((\d+),(\d+)\)/g;
  const allMuls = input.matchAll(mulRe);
  let sum = 0;
  for (const [, l, r] of allMuls) {
    sum += +l*+r;
  }
  return sum;
}

function part2(input) {
  const mulRe = /mul\((\d+),(\d+)\)/g;
  const doRe = /do\(\)/g;
  const dontRe = /don't\(\)/g;

  const doPoses = [0, ...Array.from(input.matchAll(doRe)).map(m => m.index)];
  const dontPoses = Array.from(input.matchAll(dontRe)).map(m => m.index);
  const allMuls = input.matchAll(mulRe);
  let sum = 0;
  for (const match of allMuls) {
    const closestDoBefore = doPoses.filter(p => p < match.index).pop();
    const closestDontBefore = dontPoses.filter(p => p < match.index).pop();
    if (closestDontBefore && closestDontBefore > closestDoBefore) {
      continue;
    }
    const [_, l, r] = match;
    sum += +l*+r;
  }
  return sum;
}

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
