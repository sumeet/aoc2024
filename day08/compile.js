#!/usr/bin/node

const fs = require('fs');
require('../bundle/compiler_cmij.js');
require('../bundle/core_cmij.js');
require('../compiler.js');

if (process.argv[0] === '/usr/bin/node') process.argv.shift();
const input = fs.readFileSync(process.argv[1], 'utf8');

const c = rescript_compiler.make();
const res = c.rescript.compile(input);

if (res.errors) {
  for (const e of res.errors) console.error(e.fullMsg);
  process.exit(1);
}

console.log(res.js_code);
