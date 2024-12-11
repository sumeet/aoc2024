function part1(input) {
  input = input.trim();
  const repr = [];
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    let num = Number(input[i]);
    if (i % 2 === 0) repr.push(...Array(num).fill(id++));
    else  repr.push(...Array(num).fill('.'));
  }
  for (let i = repr.length - 1; i >= 0; i--) {
    if (repr[i] === '.') continue;
    for (let j = 0; j < i; j++) {
      if (repr[j] === '.') [repr[i], repr[j]] = [repr[j], repr[i]];
    }
  }
  let sum = 0;
  for (const [i, n] of repr.entries()) {
    if (n === '.') break;
    sum += i * n;
  }
  return sum;
}

function part2(input) {
  input = input.trim();
  let id = 0;
  const repr = [];
  for (let i = 0; i < input.length; i++) {
    let num = Number(input[i]);
    if (i % 2 === 0) repr.push({type: 'file', id: id++, size: num});
    else repr.push({type: 'free', size: num});
  }
  for (let i = repr.length - 1; i >= 0; i--) {
    const file = repr[i];
    if (file.type !== 'file') continue;
    for (let j = 0; j < i; j++) {
      const free = repr[j];
      if (free.type === 'free' && free.size >= file.size) {
        repr[i] = {type: 'free', size: file.size};
        repr.splice(j, 1, file, {type: 'free', size: free.size - file.size});
        i++;
        break;
      }
    }
  }
  let sum = 0;
  let block = 0;
  for (const obj of repr) {
    if (obj.type === 'file') {
      for (let i = 0 ; i < obj.size; i++) {
        sum += obj.id * block++;
      }
    } else {
      block += obj.size;
    }
  }
  return sum;
}


const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf-8');
//const input = "2333133121414131402";
//console.log('part 1');
//console.log(part1(input));
console.log('part 2');
console.log(part2(input));

