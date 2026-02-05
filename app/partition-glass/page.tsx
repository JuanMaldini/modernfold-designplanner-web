"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type DimensionMode = "inches" | "feet-inches" | "metric";
type Step =
  | "dimensions"
  | "configuration"
  | "pocket"
  | "closure"
  | "rail"
  | "egress"
  | "model"
  | "track"
  | "glass"
  | "finish"
  | "project_info"
  | "summary";

interface DimensionValue {
  mode: DimensionMode;
  inches?: number;
  feet?: number;
  inchMain?: number;
  numerator?: number;
  denominator?: number;
  millimeters?: number;
}

type PanelConfig = "single-panel" | "dual-panel" | "multi-panel";
type PocketType = "wtw" | "inside" | "outside";
type ClosureType = "pivot" | "sliding";
type RailType = "surface" | "patch";
type EgressType = "none" | "breakaway" | "swing";
type ModelType = "acousti-clear" | "hsw";
type TrackType = "standard" | "heavy";
type GlassType = "clear" | "frosted" | "custom";
type FinishType = "clear" | "bronze" | "black" | "satin" | "custom";

interface ProjectInfo {
  projectName: string;
  city: string;
  state: string;
  zip: string;
  architect: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export default function GlassPartition() {
  const ACCENT = "emerald-500";
  const card = "bg-transparent border border-white/5 rounded-md p-2";
  const smallBtn = "px-3 py-2 rounded-md text-sm font-bold";
  const STEP_ORDER: Step[] = [
    "dimensions",
    "configuration",
    "pocket",
    "closure",
    "rail",
    "egress",
    "model",
    "track",
    "glass",
    "finish",
    "project_info",
    "summary",
  ];

  const STEP_LABELS: Record<Step, string> = {
    dimensions: "Dimensions",
    configuration: "Configuration",
    pocket: "Pocket",
    closure: "Closure",
    rail: "Rail System",
    egress: "Egress",
    model: "Model",
    track: "Track",
    glass: "Glass Type",
    finish: "Finish",
    project_info: "Project Info",
    summary: "Summary",
  };

  const goToStep = (id: Step) => setCurrentStep(id);
  const [currentStep, setCurrentStep] = useState<Step>("dimensions");
  const [visitedSteps, setVisitedSteps] = useState<Set<Step>>(
    () => new Set(["dimensions"]),
  );
  const [location, setLocation] = useState("");
  const [width, setWidth] = useState<DimensionValue>({
    mode: "feet-inches",
    feet: 0,
    inchMain: 0,
    numerator: 0,
    denominator: 0,
  });
  const [height, setHeight] = useState<DimensionValue>({
    mode: "feet-inches",
    feet: 0,
    inchMain: 0,
    numerator: 0,
    denominator: 0,
  });
  const [panelConfig, setPanelConfig] = useState<PanelConfig | null>(null);

  // Pocket State
  const [pocketType, setPocketType] = useState<PocketType | null>(null);
  const [hasPocketDoor, setHasPocketDoor] = useState(false);

  // New State for Glass Hardware
  const [closure, setClosure] = useState<ClosureType | null>(null);
  const [rail, setRail] = useState<RailType | null>(null);
  const [egress, setEgress] = useState<EgressType | null>(null);

  // New State for Glass Model
  const [model, setModel] = useState<ModelType | null>(null);
  const [track, setTrack] = useState<TrackType | null>(null);
  const [glassType, setGlassType] = useState<GlassType | null>(null);

  // New State for Aesthetics
  const [finishType, setFinishType] = useState<FinishType | null>(null);

  // New State for Project Info
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: "",
    city: "",
    state: "",
    zip: "",
    architect: "",
    contactPerson: "",
    email: "",
    phone: "",
  });

  // Validation function for step 1
  const validateDimensions = () => {
    if (!location.trim()) {
      alert("Please enter a partition location.");
      return false;
    }

    const isValueValid = (val: DimensionValue) => {
      if (val.mode === "feet-inches")
        return (val.feet || 0) > 0 || (val.inchMain || 0) > 0;
      if (val.mode === "inches") return (val.inches || 0) > 0;
      if (val.mode === "metric") return (val.millimeters || 0) > 0;
      return false;
    };

    if (!isValueValid(width) || !isValueValid(height)) {
      alert("Please enter valid dimensions for width and height.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    setVisitedSteps((prev) => {
      const next = new Set(prev);
      next.add(currentStep);
      return next;
    });
  }, [currentStep]);
  const isDimensionsComplete = () => {
    if (!location.trim()) return false;

    const isValueValid = (val: DimensionValue) => {
      if (val.mode === "feet-inches")
        return (val.feet || 0) > 0 || (val.inchMain || 0) > 0;
      if (val.mode === "inches") return (val.inches || 0) > 0;
      if (val.mode === "metric") return (val.millimeters || 0) > 0;
      return false;
    };

    return isValueValid(width) && isValueValid(height);
  };

  const isStepComplete = (step: Step) => {
    if (!visitedSteps.has(step)) return false;
    switch (step) {
      case "dimensions":
        return isDimensionsComplete();
      case "configuration":
        return !!panelConfig;
      case "pocket":
        return !!pocketType;
      case "closure":
        return !!closure;
      case "rail":
        return !!rail;
      case "egress":
        return !!egress;
      case "model":
        return !!model;
      case "track":
        return !!track;
      case "glass":
        return !!glassType;
      case "finish":
        return !!finishType;
      case "project_info":
        return !!projectInfo.projectName.trim() && !!projectInfo.email.trim();
      case "summary":
        return false;
      default:
        return false;
    }
  };

  const isFormComplete = () => {
    return STEP_ORDER.filter((step) => step !== "summary").every((step) =>
      isStepComplete(step),
    );
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleNextStep = () => {
    if (currentStep === "dimensions") {
      if (validateDimensions()) {
        setCurrentStep("configuration");
      }
    } else if (currentStep === "configuration") {
      if (!panelConfig) {
        alert("Please select a panel configuration.");
        return false;
      }
      setCurrentStep("pocket");
    } else if (currentStep === "pocket") {
      if (!pocketType) {
        alert("Please select a storage condition (pocket).");
        return false;
      }
      setCurrentStep("closure");
    } else if (currentStep === "closure") {
      if (!closure) {
        alert("Please select a closure method.");
        return false;
      }
      setCurrentStep("rail");
    } else if (currentStep === "rail") {
      if (!rail) {
        alert("Please select a rail system.");
        return false;
      }
      setCurrentStep("egress");
    } else if (currentStep === "egress") {
      if (!egress) {
        alert("Please select an egress option.");
        return false;
      }
      setCurrentStep("model");
    } else if (currentStep === "model") {
      if (!model) {
        alert("Please select a glass model.");
        return false;
      }
      setCurrentStep("track");
    } else if (currentStep === "track") {
      if (!track) {
        alert("Please confirm the track system.");
        return false;
      }
      setCurrentStep("glass");
    } else if (currentStep === "glass") {
      if (!glassType) {
        alert("Please select a glass type.");
        return false;
      }
      setCurrentStep("finish");
    } else if (currentStep === "finish") {
      if (!finishType) {
        alert("Please select a finish option.");
        return false;
      }
      setCurrentStep("project_info");
    } else if (currentStep === "project_info") {
      if (!projectInfo.projectName || !projectInfo.email) {
        alert("Please enter at least the Project Name and Email.");
        return false;
      }
      setCurrentStep("summary");
    }
  };

  const handlePrevStep = () => {
    if (currentStep === "configuration") setCurrentStep("dimensions");
    if (currentStep === "pocket") setCurrentStep("configuration");
    if (currentStep === "closure") setCurrentStep("pocket");
    if (currentStep === "rail") setCurrentStep("closure");
    if (currentStep === "egress") setCurrentStep("rail");
    if (currentStep === "model") setCurrentStep("egress");
    if (currentStep === "track") setCurrentStep("model");
    if (currentStep === "glass") setCurrentStep("track");
    if (currentStep === "finish") setCurrentStep("glass");
    if (currentStep === "project_info") setCurrentStep("finish");
    if (currentStep === "summary") setCurrentStep("project_info");
  };

  const resetForm = () => {
    setLocation("");
    setWidth({
      mode: "feet-inches",
      feet: 0,
      inchMain: 0,
      numerator: 0,
      denominator: 0,
    });
    setHeight({
      mode: "feet-inches",
      feet: 0,
      inchMain: 0,
      numerator: 0,
      denominator: 0,
    });
    setPanelConfig(null);
    setPocketType(null);
    setHasPocketDoor(false);
    setClosure(null);
    setRail(null);
    setEgress(null);
    setModel(null);
    setTrack(null);
    setGlassType(null);
    setFinishType(null);
    setProjectInfo({
      projectName: "",
      city: "",
      state: "",
      zip: "",
      architect: "",
      contactPerson: "",
      email: "",
      phone: "",
    });
    setCurrentStep("dimensions");
  };

  const renderDimensionInput = (
    label: string,
    value: DimensionValue,
    onChange: (val: DimensionValue) => void,
  ) => {
    return (
      <div className="bg-white/5  p-2 transition-all hover:border-emerald-500/30 group">
        <h3 className="text-md font-semibold mb-2 text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          {label}
        </h3>

        <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-xl w-fit border border-white/5">
          {(["feet-inches", "inches", "metric"] as DimensionMode[]).map(
            (mode) => (
              <button
                key={mode}
                onClick={() => onChange({ ...value, mode })}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  value.mode === mode
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {mode === "feet-inches"
                  ? "Ft & In"
                  : mode === "inches"
                    ? "Inches"
                    : "Metric"}
              </button>
            ),
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {value.mode === "feet-inches" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">
                  Feet
                </label>
                <input
                  type="number"
                  defaultValue={value.feet || ""}
                  onBlur={(e) =>
                    onChange({ ...value, feet: Number(e.target.value) })
                  }
                  className="bg-black/60 border border-white/10 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">
                  Inches
                </label>
                <input
                  type="number"
                  defaultValue={value.inchMain || ""}
                  onBlur={(e) =>
                    onChange({ ...value, inchMain: Number(e.target.value) })
                  }
                  className="bg-black/60 border border-white/10 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">
                  Fraction
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={value.numerator || ""}
                    onBlur={(e) =>
                      onChange({ ...value, numerator: Number(e.target.value) })
                    }
                    className="bg-black/60 border border-white/10 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all w-full font-mono text-center text-sm"
                    placeholder="Num"
                  />
                  <span className="text-white/20 font-light text-2xl">/</span>
                  <input
                    type="number"
                    defaultValue={value.denominator || ""}
                    onBlur={(e) =>
                      onChange({
                        ...value,
                        denominator: Number(e.target.value),
                      })
                    }
                    className="bg-black/60 border border-white/10 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all w-full font-mono text-center text-sm"
                    placeholder="Den"
                  />
                </div>
              </div>
            </>
          )}

          {value.mode === "inches" && (
            <div className="flex flex-col gap-1.5 col-span-4">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">
                Total Inches
              </label>
              <input
                type="number"
                step="0.01"
                defaultValue={value.inches || ""}
                onBlur={(e) =>
                  onChange({ ...value, inches: Number(e.target.value) })
                }
                className="bg-black/60 border border-white/10 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                placeholder="0.00"
              />
            </div>
          )}

          {value.mode === "metric" && (
            <div className="flex flex-col gap-1.5 col-span-4">
              <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] ml-1">
                Millimeters (mm)
              </label>
              <input
                type="number"
                step="0.1"
                defaultValue={value.millimeters || ""}
                onBlur={(e) =>
                  onChange({ ...value, millimeters: Number(e.target.value) })
                }
                className="bg-black/60 border border-white/10 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                placeholder="0.0"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConfigurationStep = () => {
    const options = [
      {
        id: "single-panel" as PanelConfig,
        title: "Single Panel",
        description:
          "Individual glass panel configuration. Ideal for simple openings and minimalist designs.",
        app: "Conference rooms, Office partitions, Private spaces.",
      },
      {
        id: "dual-panel" as PanelConfig,
        title: "Dual Panel",
        description:
          "Two panel system with coordinated operation. Perfect for medium-sized openings requiring flexibility.",
        app: "Meeting rooms, Breakout spaces, Collaborative areas.",
      },
      {
        id: "multi-panel" as PanelConfig,
        title: "Multi-Panel",
        description:
          "Three or more panels for large openings. Maximum flexibility for space division.",
        app: "Ballrooms, Large conference halls, Multipurpose spaces.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Select Panel Configuration
          </h2>
          <p className="text-slate-400 text-sm">
            Choose the operational mode that best fits your space requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPanelConfig(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                panelConfig === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${panelConfig === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    panelConfig === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {panelConfig === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2 leading-relaxed">
                {opt.description}
              </p>
              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">
                  Common Applications
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {opt.app}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPocketStep = () => {
    const options = [
      {
        id: "wtw" as PocketType,
        title: "Wall to Wall",
        description:
          "No pocket. Panels stack against the wall within the room.",
        allowDoor: false,
      },
      {
        id: "inside" as PocketType,
        title: "Pocket Inside Room",
        description: "Storage pocket constructed within the room boundaries.",
        allowDoor: true,
      },
      {
        id: "outside" as PocketType,
        title: "Pocket Outside Room",
        description:
          "Storage pocket constructed outside the room boundaries (remote).",
        allowDoor: true,
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Select Storage Condition
          </h2>
          <p className="text-slate-400 text-sm">
            Define how and where the panels will be stored when not in use.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`relative rounded-2xl border transition-all ${
                pocketType === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => {
                  setPocketType(opt.id);
                  if (!opt.allowDoor) setHasPocketDoor(false);
                }}
                className="w-full text-left p-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`text-xl font-bold ${pocketType === opt.id ? "text-emerald-400" : "text-white"}`}
                  >
                    {opt.title}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      pocketType === opt.id
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-white/20"
                    }`}
                  >
                    {pocketType === opt.id && (
                      <div className="w-2 h-2 bg-black rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {opt.description}
                </p>
              </button>

              {/* Pocket Door Toggle */}
              {opt.allowDoor && pocketType === opt.id && (
                <div className="mx-4 mb-2 pt-2 border-t border-white/10 animate-in slide-in-from-top-2 duration-300">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-12 h-7 rounded-full transition-colors relative ${hasPocketDoor ? "bg-emerald-500" : "bg-slate-700"}`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={hasPocketDoor}
                        onChange={(e) => setHasPocketDoor(e.target.checked)}
                      />
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${hasPocketDoor ? "left-[22px]" : "left-1"}`}
                      />
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Include Pocket Door
                    </span>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClosureStep = () => {
    const options = [
      {
        id: "pivot" as ClosureType,
        title: "Pivot Closure",
        description:
          "Panel pivots on center or offset axis. Provides elegant entry and exit points.",
      },
      {
        id: "sliding" as ClosureType,
        title: "Sliding Closure",
        description:
          "Panel slides along track system. Ideal for space-efficient operation.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Select Closure Method
          </h2>
          <p className="text-slate-400 text-sm">
            Choose how the final panel closes the opening.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setClosure(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                closure === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${closure === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    closure === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {closure === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderRailStep = () => {
    const options = [
      {
        id: "surface" as RailType,
        title: "Surface Rails",
        description:
          "Traditional overhead track system. Visible hardware with robust support.",
      },
      {
        id: "patch" as RailType,
        title: "Patch Fittings",
        description:
          "Minimalist point-fixed system. Nearly invisible hardware for modern aesthetics.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Rail System</h2>
          <p className="text-slate-400 text-sm">
            Select the mounting and support system for the glass panels.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRail(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                rail === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${rail === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    rail === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {rail === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderEgressStep = () => {
    const options = [
      {
        id: "none" as EgressType,
        title: "No Egress",
        description:
          "Standard fixed panel installation with no emergency exit.",
      },
      {
        id: "breakaway" as EgressType,
        title: "Breakaway",
        description:
          "Panels release from track under pressure for emergency egress.",
      },
      {
        id: "swing" as EgressType,
        title: "Swing Door",
        description:
          "Dedicated swing door panel for code-compliant emergency exit.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Egress Option</h2>
          <p className="text-slate-400 text-sm">
            Select emergency exit requirements for the installation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setEgress(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                egress === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${egress === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    egress === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {egress === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderModelStep = () => {
    const options = [
      {
        id: "acousti-clear" as ModelType,
        title: "Acousti-Clear",
        description:
          "Acoustic glass panel system. Provides sound control with visual transparency.",
        app: "Conference rooms, Huddle spaces, Executive offices.",
      },
      {
        id: "hsw" as ModelType,
        title: "HSW Glass Wall",
        description:
          "Heavy-duty glass wall system. Maximum structural integrity for large spans.",
        app: "Lobbies, Atriums, High-traffic areas.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Select Glass Model
          </h2>
          <p className="text-slate-400 text-sm">
            Choose the glass partition system type.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setModel(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                model === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${model === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    model === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {model === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-2 leading-relaxed">
                {opt.description}
              </p>
              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">
                  Applications
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {opt.app}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTrackStep = () => {
    const options = [
      {
        id: "standard" as TrackType,
        title: "Standard Track",
        description:
          "Standard aluminum track system for typical glass panel weights.",
      },
      {
        id: "heavy" as TrackType,
        title: "Heavy Duty Track",
        description:
          "Reinforced track system for larger, heavier glass panels.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Track System</h2>
          <p className="text-slate-400 text-sm">
            Select the suspension system suitable for your configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTrack(opt.id)}
              className={`text-left p-2 rounded-2xl border transition-all ${
                track === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-xl font-bold ${track === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    track === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-white/20"
                  }`}
                >
                  {track === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderGlassStep = () => {
    const options = [
      {
        id: "clear" as GlassType,
        title: "Clear Glass",
        description: "Standard transparent glass. Maximum light transmission.",
      },
      {
        id: "frosted" as GlassType,
        title: "Frosted Glass",
        description:
          "Translucent finish. Provides privacy while allowing light.",
      },
      {
        id: "custom" as GlassType,
        title: "Custom Glass",
        description: "Tinted, patterned, or specialty glass options available.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Glass Type</h2>
          <p className="text-slate-400 text-sm">
            Select the glass transparency and finish.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setGlassType(opt.id)}
              className={`text-left p-2 rounded-xl border transition-all flex items-center justify-between group ${
                glassType === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                <h3
                  className={`font-bold ${glassType === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1">{opt.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  glassType === opt.id
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-white/20"
                }`}
              >
                {glassType === opt.id && (
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFinishStep = () => {
    const options = [
      {
        id: "clear" as FinishType,
        title: "Clear Anodized",
        description: "Natural aluminum finish with protective coating.",
      },
      {
        id: "bronze" as FinishType,
        title: "Bronze Anodized",
        description: "Warm bronze tone for traditional aesthetics.",
      },
      {
        id: "black" as FinishType,
        title: "Black Anodized",
        description: "Modern matte black finish for contemporary spaces.",
      },
      {
        id: "satin" as FinishType,
        title: "Satin Stainless",
        description: "Brushed stainless steel appearance.",
      },
      {
        id: "custom" as FinishType,
        title: "Custom Finish",
        description: "Powder-coated or specialty finishes available.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Hardware Finish
          </h2>
          <p className="text-slate-400 text-sm">
            Select the finish for all metal components.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFinishType(opt.id)}
              className={`text-left p-2 rounded-xl border transition-all flex items-center justify-between group ${
                finishType === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                <h3
                  className={`font-bold ${finishType === opt.id ? "text-emerald-400" : "text-white"}`}
                >
                  {opt.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1">{opt.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  finishType === opt.id
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-white/20"
                }`}
              >
                {finishType === opt.id && (
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectInfoStep = () => {
    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-sm mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">
            Project Information
          </h2>
          <p className="text-slate-400 text-sm">
            Please provide details about the project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={projectInfo.projectName}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, projectName: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
              placeholder="e.g. Modernfold HQ Renovation"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              City
            </label>
            <input
              type="text"
              value={projectInfo.city}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, city: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              State / Zip
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={projectInfo.state}
                onChange={(e) =>
                  setProjectInfo({ ...projectInfo, state: e.target.value })
                }
                className="w-1/3 bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="State"
              />
              <input
                type="text"
                value={projectInfo.zip}
                onChange={(e) =>
                  setProjectInfo({ ...projectInfo, zip: e.target.value })
                }
                className="w-2/3 bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Zip Code"
              />
            </div>
          </div>

          <div className="col-span-2 h-[1px] bg-white/5 my-2" />

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Architect / Designer
            </label>
            <input
              type="text"
              value={projectInfo.architect}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, architect: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={projectInfo.contactPerson}
              onChange={(e) =>
                setProjectInfo({
                  ...projectInfo,
                  contactPerson: e.target.value,
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={projectInfo.email}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, email: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={projectInfo.phone}
              onChange={(e) =>
                setProjectInfo({ ...projectInfo, phone: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#050505] text-slate-200 font-sans selection:bg-emerald-500/30 w-full min-h-full">
      <div className="flex flex-col w-full">
        {/* Main Content */}
        <div className="w-full relative">
          <div className="w-full p-1">
            <header className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-2 bg-[color:var(--accent,#10b981)] rounded-sm" />
                <h1 className="text-xl font-black tracking-tight text-white flex items-baseline gap-2">
                  Design Planner
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {STEP_LABELS[currentStep]}
                  </span>
                </h1>
              </div>

              {/* Radial Step Tracker (compact) */}
              <div className="flex gap-2 mb-2 flex-wrap">
                {STEP_ORDER.map((id, idx) => {
                  const isActive = currentStep === id;
                  const isCompleted =
                    id === "summary"
                      ? currentStep === "summary" && isFormComplete()
                      : isStepComplete(id);
                  return (
                    <button
                      key={id}
                      onClick={() => goToStep(id)}
                      aria-current={isActive}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${isCompleted ? `bg-${ACCENT} text-black` : "bg-white/5 text-slate-500"} ${isActive ? "ring-2 ring-emerald-400/70 ring-offset-1 ring-offset-black" : ""}`}
                      title={`${idx + 1}. ${STEP_LABELS[id]}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </header>

            <section className="space-y-2">
              {currentStep === "dimensions" && (
                <div className="space-y-2">
                  <div className={`${card} w-full`}>
                    <label className="block text-xs text-slate-400 uppercase font-bold mb-1">
                      Partition Location
                    </label>
                    <input
                      type="text"
                      defaultValue={location}
                      onBlur={(e) => setLocation(e.target.value)}
                      placeholder="EX: BALLROOM A, OFFICE 201..."
                      className="w-full bg-transparent border-none px-2 py-2 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    {renderDimensionInput("Opening Width", width, setWidth)}
                    {renderDimensionInput("Opening Height", height, setHeight)}
                  </div>
                </div>
              )}

              {currentStep === "configuration" && renderConfigurationStep()}

              {currentStep === "pocket" && renderPocketStep()}

              {currentStep === "closure" && renderClosureStep()}

              {currentStep === "rail" && renderRailStep()}

              {currentStep === "egress" && renderEgressStep()}

              {currentStep === "model" && renderModelStep()}

              {currentStep === "track" && renderTrackStep()}

              {currentStep === "glass" && renderGlassStep()}

              {currentStep === "finish" && renderFinishStep()}

              {currentStep === "project_info" && renderProjectInfoStep()}

              {currentStep === "summary" && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 animate-in zoom-in-95 duration-500">
                  {isFormComplete() ? (
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-white mb-2 text-center">
                    {isFormComplete()
                      ? "Configuration Complete"
                      : "Configuration Incomplete"}
                  </h2>
                  <p className="text-slate-400 mb-4 text-center">
                    {isFormComplete()
                      ? "Here is the summary of your glass partition specification."
                      : "Complete all steps to finalize the configuration."}
                  </p>

                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Dimensions & Location
                      </span>
                      <span className="text-slate-500">Location:</span>{" "}
                      <span className="text-right">{location}</span>
                      <span className="text-slate-500">Width:</span>{" "}
                      <span className="text-right">
                        {width.feet}' {width.inchMain}"
                      </span>
                      <span className="text-slate-500">Height:</span>{" "}
                      <span className="text-right">
                        {height.feet}' {height.inchMain}"
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Configuration
                      </span>
                      <span className="text-slate-500">Panel Layout:</span>{" "}
                      <span className="text-right capitalize">
                        {panelConfig}
                      </span>
                      <span className="text-slate-500">Pocket:</span>{" "}
                      <span className="text-right capitalize">
                        {pocketType === "wtw" ? "Wall to Wall" : pocketType}
                      </span>
                      <span className="text-slate-500">Pocket Door:</span>{" "}
                      <span className="text-right">
                        {hasPocketDoor ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Hardware & Glass
                      </span>
                      <span className="text-slate-500">Closure:</span>{" "}
                      <span className="text-right capitalize">{closure}</span>
                      <span className="text-slate-500">Rail System:</span>{" "}
                      <span className="text-right capitalize">{rail}</span>
                      <span className="text-slate-500">Egress:</span>{" "}
                      <span className="text-right capitalize">{egress}</span>
                      <span className="text-slate-500">Model:</span>{" "}
                      <span className="text-right capitalize">{model}</span>
                      <span className="text-slate-500">Track:</span>{" "}
                      <span className="text-right capitalize">{track}</span>
                      <span className="text-slate-500">Glass Type:</span>{" "}
                      <span className="text-right capitalize">{glassType}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Finish
                      </span>
                      <span className="text-slate-500">Hardware Finish:</span>{" "}
                      <span className="text-right capitalize">
                        {finishType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Project Info
                      </span>
                      <span className="text-slate-500">Project:</span>{" "}
                      <span className="text-right">
                        {projectInfo.projectName}
                      </span>
                      <span className="text-slate-500">Contact:</span>{" "}
                      <span className="text-right">
                        {projectInfo.contactPerson}
                      </span>
                      <span className="text-slate-500">Email:</span>{" "}
                      <span className="text-right">{projectInfo.email}</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      disabled={
                        !isFormComplete() || !isEmailValid(projectInfo.email)
                      }
                      className={`w-full rounded-md py-2 text-sm font-bold transition-all ${
                        isFormComplete() && isEmailValid(projectInfo.email)
                          ? `bg-${ACCENT} text-black`
                          : "bg-white/10 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Request a quote
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
