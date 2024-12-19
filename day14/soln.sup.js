function part1(input) {
  let totals = [0, 0, 0, 0];
  const quadrants = [
    [
      0, Math.trunc(HEIGHT / 2),
      0, Math.trunc(WIDTH / 2)
    ],
    [
      0, Math.trunc(HEIGHT / 2),
      Math.trunc(WIDTH / 2) + 1, WIDTH
    ],
    [
      Math.trunc(HEIGHT / 2) + 1, HEIGHT,
      0, Math.trunc(WIDTH / 2)
    ],
    [
      Math.trunc(HEIGHT / 2) + 1, HEIGHT,
      Math.trunc(WIDTH / 2) + 1, WIDTH
    ],
  ];

  console.log(quadrants);

  const graph = Array(HEIGHT).fill().map(() => Array(WIDTH).fill('.'));

  for (const line of input.trim().split('\n')) {
    let [px, py, vx, vy] = line.matchAll(/-?\d+/g).map(Number);

    for (let i = 0; i < 100; i++) {
      [py, px] = [
        ((py + vy) + HEIGHT) % HEIGHT,
        ((px + vx) + WIDTH) % WIDTH,
      ]
    }

    if (graph[py][px] === '.') {
      graph[py][px] = 0;
    }
    graph[py][px]++;

    for (const [i, [ly, hy, lx, hx]] of quadrants.entries()) {
      if (py >= ly && py < hy && px >= lx && px < hx) {
        totals[i]++;
        break;
      }
    }
  }

  //for (let row of graph) {
  //  console.log(row.join(''));
  //}

  console.log(totals);
  return totals.reduce((a, b) => a * b);
}

function part2(input) {
  let lines = input.trim().split('\n');
  let robots = lines.map(line => line.match(/-?\d+/g).map(Number));

  // 10401 -> num of iterations before going back to starting position
  outer: for (let i = 0 ; i < 10401; i++) {
    for (let [j, [px, py, vx, vy]] of robots.entries()) {
      [py, px] = [
        ((py + vy) + HEIGHT) % HEIGHT,
        ((px + vx) + WIDTH) % WIDTH,
      ]
      robots[j] = [px, py, vx, vy];
    }

    const graph = Array(HEIGHT).fill().map(() => Array(WIDTH).fill('.'));
    for (const [px, py, vx, vy] of robots) {
      if (graph[py][px] === '.') {
        graph[py][px] = 0;
      }
      graph[py][px]++;
    }

    let numFilledRows = 0;
    for (const row of graph) {
      const N = 5;
      for (let i = N; i < WIDTH; i++) {
        if (row.slice(i - N, i).every(v => v !== '.')) {
          numFilledRows++;
          break;
        }
      }
    }

    if (numFilledRows >= 5) {
      console.log(`---- Time: ${i+1}: ------`);
      for (let row of graph) {
        console.log(row.join(''));
      }
      console.log('\n\n');
    }
  }
}



const fs = require('fs');

//const input = fs.readFileSync('sample.txt', 'utf-8');
////const input = "p=2,4 v=2,-3";
//const WIDTH = 11;
//const HEIGHT = 7;


const WIDTH = 101;
const HEIGHT = 103;
const input = fs.readFileSync('input.txt', 'utf-8');


//console.log(part1(input));
console.log(part2(input));
