import test from 'ava';

import { delay, wait, debounce } from '../src';

/** 记录时间差 */
function diffTime() {
  const start = Date.now();

  return function timeEnd() {
    const end = Date.now();
    return (end - start);
  };
}

test.cb('delay', (t) => {
  let result = false;

  delay(100).then(() => result = true);

  setTimeout(() => t.false(result), 80);
  setTimeout(() => t.true(result), 120);
  setTimeout(() => t.end(), 130);
});

test.cb('wait', (t) => {
  let result = false;
  const diff = diffTime();
  const changeTime = 200;

  setTimeout(() => result = true, changeTime);

  wait(() => result, 10).then(() => {
    const bias = Math.abs(diff() - changeTime);

    t.true(result);
    t.true(bias < 30);
    t.end();
  });
});

test.cb('debounce', (t) => {
  let count = 0;

  const fn = debounce((diff: number) => count += diff, 50);
  
  fn(2);

  delay(10)
    .then(() => {
      fn(2);
      return delay(20);
    })
    .then(() => {
      fn(2);
      return delay(70);
    })
    .then(() => {
      fn(2);
      return delay(20);
    })
    .then(() => {
      fn(2);
      return delay(70);
    })
    .then(() => {
      t.is(count, 4);
      t.end();
    });
});
