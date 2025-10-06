import { useState } from "react";
import RangeControls from "./components/RangeControls";
import type { RangeControlsState } from "./components/RangeControls";
import TrainerPanel from "./components/TrainerPanel";
import type { Range } from "./lib/types";



export default function App() {
  const [range, setRange] = useState<Range>({ from: 100, to: 999, });
  const [showInfo, setShowInfo] = useState(true);

  const [rcState, setRcState] = useState<RangeControlsState>({
    mode: "digits",
    digits: 3,
    customFrom: 1,
    customTo: 1000,
    length: 100,
    zeroOffset: true,
  });

  const onRcChange = (patch: Partial<RangeControlsState>) => setRcState((s) => ({ ...s, ...patch }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Binary Search Trainer</h1>
          <a
            className="text-sm underline opacity-80 hover:opacity-100"
            href="https://github.com/an-ivannikov/binary-search-trainer"
            target="_blank"
            rel="noreferrer"
          >GitHub</a>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <RangeControls
            state={rcState}
            onChange={onRcChange}
            onGenerate={(r) => setRange(r)}
            current={range}
          />
          <TrainerPanel
            range={range}
            onResetRange={() => setRange(range)}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
          />
        </section>

        <footer className="mt-8 text-center text-xs opacity-60">
          <p>
            The app chooses a worst-case number for classic binary search. For very large ranges,
            it uses a heuristic: always move into the larger half.
          </p>
        </footer>
      </div>
    </div>
  );
}
