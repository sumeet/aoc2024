function part1(input) {
    const lines = input.split('\n');
    const a = [];
    const b = [];
    for (const line of lines) {
        const [first, second] = line.split(/\s+/).map(Number);
        a.push(first);
        b.push(second);
    }
    a.sort();
    b.sort();
    let sum = 0;
    for (const i in a) sum += Math.abs(a[i] - b[i]);
    return sum;
}

function part2(input) {
    const lines = input.split('\n');
    const a = [];
    const b = [];
    for (const line of lines) {
        const [first, second] = line.split(/\s+/).map(Number);
        a.push(first);
        b.push(second);
    }
    let sum = 0;
    for (const i in a) {
        const count = b.filter(x => x === a[i]).length;
        sum += count * a[i];
    }
    return sum;
}
