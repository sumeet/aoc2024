function part1(input) {
  const lines = input.trim().split('\n');
  let total = 0;
  for (const line of lines) {
    const nums = line.split(" ").map(Number);
    total += validate(nums);
  }
  return total;
}

function part2(input) {
  const lines = input.trim().split('\n');
  let total = 0;
  for (const line of lines) {
    const numss = allRemovals(line.split(" ").map(Number));
    total += numss.some(validate);
  }
  return total;
}

function validate(nums) {
  let valid = true;
  let increasing = nums[1] - nums[0] > 0;
  for (let i = 1; i < nums.length && valid; i++) {
    const match = (nums[i] - nums[i - 1]) > 0 === increasing;
    const diff = Math.abs(nums[i] - nums[i - 1]);
    valid = match && diff >= 1 && diff <= 3;
  }
  return valid;
}

function allRemovals(numbers) {
  const removals = [numbers.slice()];
  for (const i in numbers) {
    const removed = numbers.slice();
    removed.splice(i, 1);
    removals.push(removed);
  }
  return removals;
}

const input = require('fs').readFileSync('input.txt', 'utf-8')
console.log('part 1');
console.log(part1(input));

console.log('part 2');
console.log(part2(input));
