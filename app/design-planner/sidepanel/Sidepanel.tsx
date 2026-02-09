import { useState } from "react";
import { sendDynamicCommand } from "../utils/vagon-messaging";
import OperablePartition from "../../partition-operable/page";
import GlassPartition from "../../partition-glass/page";

export default function Sidepanel() {
  const [lastCommand, setLastCommand] = useState<string>(
    "No commands sent yet", 
  );
  const [activePartition, setActivePartition] = useState<
    "operable" | "glass" | null
  >(null);

  const handleCommand = (category: string, action: string, value: any) => {
    const commandStr = JSON.stringify({ category, action, value });
    setLastCommand(`${commandStr}`);
    console.log(`[Vagon UI] ${commandStr}`);
    sendDynamicCommand(category, action, value);
  };

  return (
    <div className="modernfold-light bg-slate-50 text-slate-800 w-full h-full overflow-y-auto">
    
      <div className="mb-2">
        <p className="text-emerald-400 text-[10px] font-mono bg-black/40 p-3  break-all">
          <span className="text-slate-500 mr-2">STATUS:</span>
          {lastCommand}
        </p>
      </div>
      <div className="flex flex-row gap-2 px-2">
        <button
          type="button"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-1 rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
          onClick={() => handleCommand("Interaction", "ColorChange", "White")}>
          test command
        </button>
      </div>
     

      <div className="mt-2 flex flex-col gap-3">
        <strong className="text-slate-600 text-center text-xs uppercase tracking-widest">
          Select Configuration
        </strong>
        <div className="grid grid-cols-2 gap-2 px-2">
          <button
            onClick={() => setActivePartition("operable")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activePartition === "operable"
                ? "bg-emerald-600 text-white ring-1 ring-inset ring-emerald-600"
                : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:ring-slate-300"
            }`}
          >
            Operable
          </button>
          <button
            onClick={() => setActivePartition("glass")}
            className={`px-3 rounded-lg text-xs font-bold transition-all ${
              activePartition === "glass"
                ? "bg-emerald-600 text-white ring-1 ring-inset ring-emerald-600"
                : "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:ring-slate-300"
            }`}
          >
            Glass
          </button>
        </div>
      </div>

      <div className="pt-2">
        {activePartition ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-y-auto">
              {activePartition === "operable" ? (
                <OperablePartition />
              ) : (
                <GlassPartition />
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
