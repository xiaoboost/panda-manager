import test from 'ava';

import { install } from './env';

test.before(() => {
  install();
});

test('test', ({ pass }) => {
  pass();
});
