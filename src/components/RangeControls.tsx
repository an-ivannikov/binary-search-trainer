import { rangeByLength, rangeForDigits, normalizeRange } from "../lib/binary";
import type { Range } from "../lib/types";



type Mode = "digits" | "custom" | "length";

export interface RangeControlsState {
  mode: Mode;
  digits: 2 | 3 | 4 | 5;
  customFrom: number;
  customTo: number;
  length: number;
  zeroOffset: boolean;
};

interface Props {
  state: RangeControlsState;
  onChange: (patch: Partial<RangeControlsState>) => void;
  onGenerate: (r: Range) => void;
  current: Range;
};

export default function RangeControls({ state, onChange, onGenerate, current }: Props) {
  const makeRange = () => {
    let r: Range;
    if (state.mode === "digits") {
      r = rangeForDigits(state.digits);
    } else if (state.mode === "length") {
      r = rangeByLength(state.length, state.zeroOffset);
    } else {
      r = normalizeRange(state.customFrom, state.customTo);
    }
    onGenerate(r);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">1) Range</h2>
      <div className="mb-3 flex flex-wrap gap-2">
        {(["digits", "custom", "length"] as Mode[]).map(m => (
          <button
            key={m}
            className={`px-3 py-1 rounded-full border ${state.mode === m ? "bg-slate-900 text-white" : "bg-white"}`}
            onClick={() => onChange({ mode: m })}
          >
            {m === "digits" && "By digits (2/3/4/5)"}
            {m === "custom" && "Custom from/to"}
            {m === "length" && "By length + offset"}
          </button>
        ))}
      </div>

      {state.mode === "digits" && (
        <div className="flex items-center gap-3">
          <label className="text-sm">Digits:</label>
          <select
            className="rounded-md border px-3 py-2"
            value={state.digits}
            onChange={e => onChange({ digits: Number(e.target.value) as any, })}
          >
            <option value={2}>2 (10..99)</option>
            <option value={3}>3 (100..999)</option>
            <option value={4}>4 (1000..9999)</option>
            <option value={5}>5 (10000..99999)</option>
          </select>
        </div>
      )}

      {state.mode === "custom" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">From</label>
            <input className="w-full rounded-md border px-3 py-2" type="number" value={state.customFrom}
              onChange={e => onChange({ customFrom: Math.floor(Number(e.target.value)) })} />
          </div>
          <div>
            <label className="block text-sm mb-1">To</label>
            <input className="w-full rounded-md border px-3 py-2" type="number" value={state.customTo}
              onChange={e => onChange({ customTo: Math.floor(Number(e.target.value)) })} />
          </div>
        </div>
      )}

      {state.mode === "length" && (
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <label className="block text-sm mb-1">Range length</label>
            <input className="w-full rounded-md border px-3 py-2" type="number" min={2} max={100000}
              value={state.length} onChange={e => onChange({ length: Math.floor(Number(e.target.value)) })} />
          </div>
          <label className="inline-flex items-center gap-2 mb-1">
            <input type="checkbox" checked={state.zeroOffset} onChange={e => onChange({ zeroOffset: e.target.checked })} />
            Start from 0 (otherwise random offset)
          </label>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:opacity-90" onClick={makeRange}>Generate</button>
        <div className="text-sm opacity-70">Current: <span className="font-mono">[{current.from}..{current.to}]</span></div>
      </div>
    </div>
  );
}
