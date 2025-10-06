import { useMemo, useState } from "react";
import type { Range, StepLogEntry } from "../lib/types";
import { theoreticalMaxSteps } from "../lib/binary";
import { useWorstCaseTarget } from "../hooks/useWorstCaseTarget";



interface Props {
  range: Range;
  onResetRange: () => void;
  showInfo: boolean;
  setShowInfo: (v: boolean) => void;
};

export default function TrainerPanel({ range, onResetRange, showInfo, setShowInfo }: Props) {
  const [lo, setLo] = useState(range.from);
  const [hi, setHi] = useState(range.to);
  const [guess, setGuess] = useState("");
  const [steps, setSteps] = useState(0);
  const [log, setLog] = useState<StepLogEntry[]>([]);
  const [error, setError] = useState("");

  const { target, maxSteps, compute, reset } = useWorstCaseTarget();

  const currentRange = useMemo<Range>(() => ({ from: lo, to: hi }), [lo, hi]);
  const theorMax = useMemo(() => theoreticalMaxSteps(range), [range]);
  const finished = target != null && log.length > 0 && log[log.length - 1].result === "correct";

  function startGame() {
    setError("");
    setLo(range.from); setHi(range.to);
    setLog([]); setSteps(0); setGuess("");
    compute({ from: range.from, to: range.to });
  }

  function onGuess() {
    setError("");
    if (target == null) {
      setError("Press Start first"); return;
    };

    const num = Math.floor(Number(guess));
    if (!Number.isFinite(num)) {
      setError("Enter an integer"); return;
    };
    if (num < lo || num > hi) {
      setError("Guess is out of current range"); return;
    };

    const before: Range = { from: lo, to: hi, };
    let result: StepLogEntry["result"] = "correct";
    if (num === target) {
      result = "correct";
    } else if (num > target) {
      result = "less";
      setHi(num - 1);
    } else {
      result = "greater";
      setLo(num + 1);
    }

    setLog((prev) => [...prev, { step: prev.length + 1, before, guess: num, result, }]);
    setSteps((s) => s + 1);
    setGuess("");
  }

  function hardReset() {
    setLo(range.from);
    setHi(range.to);

    setSteps(0);
    setLog([]);
    setGuess("");
    setError("");

    reset();
    onResetRange();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">2) Trainer</h2>
      <div className="grid gap-3">
        <div className="text-sm">Theoretical max steps: <b>{theorMax}</b></div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:opacity-90" onClick={startGame}>Start</button>
          {target != null && (
            <div className="text-sm opacity-70">(A worst-case number has been chosen)</div>
          )}
          <a className="ml-auto text-sm underline opacity-80 hover:opacity-100" href="#" onClick={(e) => { e.preventDefault(); hardReset(); }} title="Reset">Reset</a>
        </div>

        <div className="flex items-center gap-3">
          <input
            className="w-40 rounded-md border px-3 py-2"
            type="number"
            placeholder="Your guess"
            value={guess}
            onChange={e => setGuess(e.target.value)}
          />
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:opacity-90" onClick={onGuess}>Guess</button>
          <label className="ml-auto inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showInfo} onChange={e => setShowInfo(e.target.checked)} />
            Show step details
          </label>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="rounded-xl border p-3 bg-slate-50">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div>Current range: <span className="font-mono">[{currentRange.from}..{currentRange.to}]</span></div>
            <div>Step: <b>{steps}</b>{maxSteps ? <span> / max {maxSteps}</span> : null}</div>
            {finished && target != null && (
              <div className="text-emerald-700 font-semibold">Done! Number: {target}</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-0 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">Range (before)</th>
                <th className="text-left p-2">Your guess</th>
                <th className="text-left p-2">Result</th>
                {showInfo && <th className="text-left p-2">Comment</th>}
              </tr>
            </thead>
            <tbody>
              {log.length === 0 ? (
                <tr><td className="p-3 text-slate-500" colSpan={5}>No steps yet. Make a guess.</td></tr>
              ) : log.map(e => (
                <tr key={e.step} className="border-b last:border-0">
                  <td className="p-2 font-mono">{e.step}</td>
                  <td className="p-2 font-mono">[{e.before.from}..{e.before.to}]</td>
                  <td className="p-2 font-mono">{e.guess}</td>
                  <td className="p-2">
                    {e.result === "less" && <span className="text-sky-700">Target is LESS</span>}
                    {e.result === "greater" && <span className="text-violet-700">Target is GREATER</span>}
                    {e.result === "correct" && <span className="text-emerald-700 font-semibold">CORRECT</span>}
                  </td>
                  {showInfo && (
                    <td className="p-2 opacity-80">
                      {e.result === "less" && `New range: [${e.before.from}..${e.guess - 1}]`}
                      {e.result === "greater" && `New range: [${e.guess + 1}..${e.before.to}]`}
                      {e.result === "correct" && `Found in ${e.step} step(s)`}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
