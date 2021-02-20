import test from 'ava';

import {
  isEmpty,
  isEqual,
  clone,
  checkCircularStructure,
  shadowCopy,
} from '../src';

test('isEmpty', ({ true: isTrue, false: isFalse }) => {
  isTrue(isEmpty({}));
  isFalse(isEmpty({ a: 1 }));
});

test('check-circular', ({ true: isTrue, false: isFalse }) => {
  const a: any = {};
  const b: any = { a: 1 };

  a.b = b;
  b.a = a;

  isFalse(checkCircularStructure({}));
  isFalse(checkCircularStructure({ a: 1 }));

  isTrue(checkCircularStructure(a));
  isTrue(checkCircularStructure(a));
});

test('isEqual', ({ true: isTrue, false: isFalse, throws }) => {
  isTrue(isEqual({}, {}));
  isFalse(isEqual({}, []));

  isTrue(isEqual({ a: 1 }, { a: 1 }));
  isTrue(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }));

  const a: any = { a: 1 };
  a.b = a;
  throws(() => isEqual(a, {}, true));
});

test('clone', ({ true: isTrue, throws }) => {
  const data = {
    a: 1,
    b: [1, 2, 3, 4],
    c: {
      b: [0, 1, 2, 3],
      d: 123,
      ab: () => void 0,
    },
  };

  isTrue(isEqual(clone(data), data));

  const a: any = { a: 1 };
  a.b = a;
  throws(() => clone(a));
});

test('copy-properties', ({ deepEqual, is }) => {
  const origin = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: {
      abc: 1,
    },
  };

  const copy = shadowCopy(origin, ['c', 'd', 'f']);

  is(copy.f, origin.f);
  deepEqual(copy, {
    c: 3,
    d: 4,
    f: {
      abc: 1,
    },
  });
});
