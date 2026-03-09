'use client';

export default function PreconfiguredPartition() {
  const card = "bg-white border border-slate-200 rounded-xl p-3 shadow-sm";

  return (
    <div className="modernfold-light bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500/30 w-full min-h-full pb-6">
      <div className="w-full max-w-5xl mx-auto px-3 md:px-5 py-3">
        <div className={`${card} mb-3`}>

          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
            <div className="h-6 w-2 bg-[color:var(--accent,#10b981)] rounded-sm" />
            <h1 className="text-xl font-black tracking-tight text-slate-700 flex items-baseline gap-2">
              Design Planner
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Pre-configured
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Awaiting Code</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Once a valid configuration code is entered, this section will display
            the pre-filled partition specifications ready for review and quoting.
          </p>

        </div>
      </div>
    </div>
  );
}
