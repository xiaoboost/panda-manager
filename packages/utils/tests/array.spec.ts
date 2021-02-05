import test from "ava";

import { unique } from "../src";

test("unique", ({ deepEqual }) => {
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
