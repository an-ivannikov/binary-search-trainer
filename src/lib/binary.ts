import type { Range } from "./types"



export function clamp(n: number, a: number, b: number) {
  return Math.min(Math.max(n, a), b);
}

export function randint(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function normalizeRange(a: number, b: number): Range {
  const from = Math.min(a, b);
  const to = Math.max(a, b);

  if (!Number.isFinite(from) || !Number.isFinite(to) || Math.floor(from) !== from || Math.floor(to) !== to) {
    throw new Error("Range must be integers");
  }

  if (from === to) {
    throw new Error("Range length must be > 1");
  }

  return { from, to, };
}

export function stepsToFind(range: Range, target: number): number {
  let lo = range.from;
  let hi = range.to;

  let steps = 0;
  while (lo <= hi) {
    steps++;
    const mid = Math.floor((lo + hi) / 2);
    if (mid === target) {
      return steps;
    }

    if (target < mid) {
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  return steps;
}

export function worstCaseTarget(range: Range, hardCap = 50000): { target: number; steps: number, } {
  const len = range.to - range.from + 1;
  if (len > hardCap) {
    // heuristic: always go into the larger half to reach deepest leaf
    let lo = range.from;
    let hi = range.to;

    let candidate = range.from;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const leftSize = mid - 1 - lo + 1;   // [lo, mid-1]
      const rightSize = hi - (mid + 1) + 1; // [mid+1, hi]
      if (rightSize >= leftSize) {
        candidate = Math.max(candidate, mid + 1);
        lo = mid + 1;
      } else {
        candidate = Math.min(candidate, mid - 1);
        hi = mid - 1;
      }
    }
    const steps = stepsToFind(range, candidate);
    return { target: candidate, steps };
  }

  let best = range.from;
  let bestSteps = -1;
  for (let x = range.from; x <= range.to; x++) {
    const s = stepsToFind(range, x);
    if (s > bestSteps) {
      bestSteps = s; best = x;
    }
  }

  return { target: best, steps: bestSteps, };
}

export function theoreticalMaxSteps(range: Range) {
  const n = range.to - range.from + 1;
  return Math.ceil(Math.log2(n));
}

export function rangeForDigits(d: 2 | 3 | 4 | 5): Range {
  const from = d === 2
    ? 10
    : d === 3
      ? 100
      : d === 4
        ? 1000
        : 10000;
  const to = d === 2
    ? 99
    : d === 3
      ? 999
      : d === 4
        ? 9999
        : 99999;
  return { from, to, };
}

export function rangeByLength(length: number, zeroOffset: boolean): Range {
  const len = clamp(Math.floor(length), 2, 100000);
  const from = zeroOffset ? 0 : randint(-5000, 5000);
  return { from, to: from + len - 1, };
}