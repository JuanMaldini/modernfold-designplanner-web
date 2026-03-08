'use client';

export default function PreconfiguredPartition() {
  const card = "bg-white border border-slate-200 rounded-md p-2 shadow-sm";

  return (
    <div className="modernfold-light text-slate-800 w-full">
      {/* Header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Pre-configured Design
          </span>
        </div>
        <h2 className="text-sm font-bold text-emerald-600">Design Planner</h2>
        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
          Enter a pre-configured code above to automatically populate your design settings.
        </p>
      </div>

      {/* Placeholder card */}
      <div className="px-3 pb-3">
        <div className={`${card} flex flex-col gap-2`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Awaiting Code</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Once a valid configuration code is entered, this section will display
            the pre-filled partition specifications ready for review and quoting.
          </p>
          <div className="mt-1 rounded-md bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] text-slate-400 italic">
            No code entered yet&hellip;
          </div>
        </div>
      </div>
    </div>
  );
}
