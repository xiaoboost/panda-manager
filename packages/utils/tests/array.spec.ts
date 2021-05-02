import test from 'ava';

import { unique, remove, replace, toArray, concat, exclude } from '../src';

test('unique', ({ deepEqual }) => {
  deepEqual(unique([1, 1, 2, 2]), [1, 2]);
  deepEqual(unique(["12", "abc", "abc", "12"]), ["12", "abc"]);
  deepEqual(
    unique(
      [
        {
          label: "1",
          value: 1,
        },
        {
          label: "1",
          value: 2,
        },
        {
          label: "1",
          value: 3,
        },
      ],
      ({ label }) => label
    ),
    [
      {
        label: "1",
        value: 1,
      },
    ]
  );
});

test('remove', ({ is, deepEqual }) => {
  const origin = [1, 1, 2, 2];
  const result = remove(origin, (item) => item === 2);

  is(origin, result);
  deepEqual(result, [1, 1]);

  deepEqual(remove([1, 2, 3, 4, 5], (item) => item % 2 === 0), [1, 3, 5]);
  deepEqual(remove([1, 2, 3, 4, 5], 5), [1, 2, 3, 4]);
  deepEqual(
    remove([1, 2, 3, 4, 5], (item) => item % 2 === 0, false),
    [1, 3, 4, 5],
  );
});

test('replace', ({ is, deepEqual }) => {
  const origin = [1, 1, 2, 2];
  const result = replace(origin, 10, (item) => item === 2);

  is(origin, result);
  deepEqual(result, [1, 1, 10, 2]);

  deepEqual(replace([1, 2, 3, 4, 5], 100, 4), [1, 2, 3, 100, 5]);
  deepEqual(
    replace([1, 2, 3, 4, 5], 100, (item) => item % 2 === 0),
    [1, 100, 3, 4, 5],
  );
});

test('toArray', ({ deepEqual }) => {
  deepEqual(toArray(), []);
  deepEqual(toArray(1), [1]);
  deepEqual(toArray(5), [5]);
  deepEqual(toArray([1, 2, 3]), [1, 2, 3]);
});

test('concat', ({ deepEqual }) => {
  deepEqual(
    concat([0, 1, [1, 2, , , 3], , [0, 1]], (item) => item),
    [0, 1, 1, 2, 3, 0, 1],
  );

  deepEqual(
    concat(
      [
        {
          val: [1, 2],
        },
        {
          label: 12,
        },
        {
          val: 567,
        },
      ],
      (item) => item.val,
    ),
    [1, 2, 567],
  )
});

test('exclude', ({ deepEqual }) => {
  deepEqual(exclude([0, 1, 2, 3, 4, 5], [3, 4, 5, 6, 7]), [6, 7]);
  deepEqual(exclude(['1', 'abc', 'rtg'], ['1', 'ghb']), ['ghb']);
});
