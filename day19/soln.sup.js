let cache = {};
function solve(avail, target) {
  let cached = cache[[avail, target]];
  if (cached !== undefined) return cached;
  const availThis = avail.filter(pat => target.includes(pat));
  let count = 0;
  for (const pat of avail) {
    if (pat === target) count++;
    if (target.startsWith(pat)) {
      count += solve(availThis, target.substring(pat.length));
    }
  }
  cache[[avail, target]] = count;
  return count;
}

function part1(input) {
  let [avail, targets] = input.split('\n\n');
  avail = avail.split(", ");
  targets = targets.split("\n");
  let total = 0;
  for (const target of targets) {
    total += solve(avail, target) > 0;
  }
  return total;
}

function part2(input) {
  let [avail, targets] = input.split('\n\n');
  avail = avail.split(", ");
  targets = targets.split("\n");
  let total = 0;
  for (const target of targets) {
    total += solve(avail, target);
  }
  return total;
}


const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
//const input = fs.readFileSync('sample.txt', 'utf-8');

console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
