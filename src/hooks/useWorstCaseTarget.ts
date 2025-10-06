import { useCallback, useState } from "react";
import { worstCaseTarget } from "../lib/binary";
import type { Range } from "../lib/types";



export function useWorstCaseTarget() {
  const [target, setTarget] = useState<number | null>(null);
  const [maxSteps, setMaxSteps] = useState<number>(0);

  const compute = useCallback((range: Range) => {
    const { target, steps } = worstCaseTarget(range);
    setTarget(target);
    setMaxSteps(steps);
    return { target, steps, }
  }, []);

  const reset = useCallback(() => {
    setTarget(null);
    setMaxSteps(0);
  }, []);

  return { target, maxSteps, compute, reset, };
}
