import test from 'ava';

import { stringifyClass } from '../src';

test('stringifyClass', ({ is }) => {
  is(stringifyClass('a', 'b', 'c\n\nd'), 'a b c d');
  is(stringifyClass('a', 'b', {
    'c  \ne': true,
    'd \n f': false,
  }), 'a b c e');
});
