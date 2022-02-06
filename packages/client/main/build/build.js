const esbuild = require('esbuild');
const minimist = require('minimist');
const options = minimist(process.argv);

console.log(process.cwd());

function build() {
  console.log(options);
}

build();
