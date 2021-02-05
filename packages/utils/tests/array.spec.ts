import test from 'ava';

import { unique } from '../src';

test('array', ({ deepEqual }) => {
    deepEqual(unique([1, 1, 2, 2]), [1, 2]);
    deepEqual(unique(['12', 'abc', 'abc', '12']), ['12', 'abc']);
});
