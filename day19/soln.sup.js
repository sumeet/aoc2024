const fs = require('fs');
//const input = fs.readFileSync('sample.txt', 'utf-8');
const input = fs.readFileSync('input.txt', 'utf-8');

let cache1 = {};
function solve(avail, target) {
  let cached = cache1[[avail, target]];
  if (cached !== undefined) return cached;

  function inner() {
    const availThis = avail.filter(pat => target.includes(pat));
    for (const pat of avail) {
      if (pat === target) return true;
      if (target.startsWith(pat) && solve(availThis, target.substring(pat.length))) {
        return true;
      }
    }
    return false;
  }
  let res = inner();
  cache1[[avail, target]] = res;
  return res;
}

function part1(input) {
  let [avail, targets] = input.split('\n\n');
  avail = avail.split(", ");
  targets = targets.split("\n");
  let total = 0;
  for (const target of targets) {
    total += solve(avail, target);
  }
  return total;
}

let cache2 = {};
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

console.log('part 1');
console.log(part1(input));
console.log('part 2');
console.log(part2(input));
