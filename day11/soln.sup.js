function part1(input) {
  let nums = input.trim().split(" ").map(Number);
  for (let i = 0; i < 25; i++) {
    let next = [];
    for (const num of nums) {
      if (num === 0) {
        next.push(1);
        continue;
      }
      const digits = String(num);
      if (digits.length % 2 === 0) {
        next.push(Number(digits.slice(0, digits.length/2)));
        next.push(Number(digits.slice(digits.length/2)));
        continue;
      }
      next.push(2024*num);
    }
    nums = next;
  }
  return nums.length;
}

function part2(input) {
  let nums = new Map();
  for (const n of input.trim().split(" ")) nums.set(+n, 1);
  for (let i = 0; i < 75; i++) {
    let next = new Map();
    for (const [num, count] of nums.entries()) {
      if (num === 0) {
        next.set(1, (next.get(1) || 0) + count);
        continue;
      }
      const digits = String(num);
      if (digits.length % 2 === 0) {
        let left = Number(digits.slice(0, digits.length/2));
        let right = Number(digits.slice(digits.length/2))
        next.set(left, (next.get(left) || 0) + count);
        next.set(right, (next.get(right) || 0) + count);
        continue;
      }
      let num2 = num * 2024;
      next.set(num2, (next.get(num2) || 0) + count);
    }
    nums = next;
  }
  return nums.values().reduce((a, b) => a+b);
}


//const input = "125 17";
const input = "0 4 4979 24 4356119 914 85734 698829"

console.log(part2(input));
