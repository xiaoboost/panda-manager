const path = require('path');
const fs = require('fs');

fs.unlinkSync(path.join(__dirname, '../.npmrc'));
fs.unlinkSync(path.join(__dirname, '../pnpm-lock.yaml'));
