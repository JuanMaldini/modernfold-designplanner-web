"use client";
import { ReactNode, useEffect, useState } from "react";
import { buildOperableJson } from "@/app/api/formatter";

type DimensionMode = "inches" | "feet-inches" | "metric";
type Step =
  | "dimensions"
  | "configuration"
  | "pocket"
  | "durability"
  | "stc"
  | "closure"
  | "track"
  | "bottom_seal"
  | "finish"
  | "hinge_trim"
  | "options"
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

type PanelConfig = "paired" | "single" | "single-parallel";
type PocketType = "wtw" | "inside" | "outside";
type DurabilityLevel = "highest" | "high" | "standard";
type ClosureType = "expandable" | "hinged";
type TrackType = "standard" | "heavy"; // Simplified for UI demo
type BottomSealType = "automatic" | "operable"; // Simplified for UI demo
type FinishType = "tba" | "vinyl" | "fabric" | "carpet" | "com";
type HingeType = "standard" | "soss";
type TrimColor = "clear" | "bronze" | "black" | "white" | "custom";
type WorkSurfaceType = "marker_board" | "tack_board";

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

export default function OperablePartition() {
  const ACCENT = "emerald-600";
  const card = "bg-white border border-slate-200 rounded-xl p-3 shadow-sm";
  const smallBtn = "px-3 py-2 rounded-md text-sm font-bold";
  const STEP_ORDER: Step[] = [
    "dimensions",
    "configuration",
    "pocket",
    "durability",
    "stc",
    "closure",
    "track",
    "bottom_seal",
    "finish",
    "hinge_trim",
    "options",
    "project_info",
    "summary",
  ];

  const STEP_LABELS: Record<Step, string> = {
    dimensions: "Dimensions",
    configuration: "Configuration",
    pocket: "Storage Condition",
    durability: "Durability",
    stc: "STC",
    closure: "Closure",
    track: "Track",
    bottom_seal: "Bottom Seal",
    finish: "Finish",
    hinge_trim: "Hinge & Trim",
    options: "Options",
    project_info: "Project Info",
    summary: "Summary",
  };

  const goToStep = (id: Step) => setCurrentStep(id);
  const [currentStep, setCurrentStep] = useState<Step>("dimensions");
  const [visitedSteps, setVisitedSteps] = useState<Set<Step>>(
    () => new Set(["dimensions"]),
  );
  const [location, setLocation] = useState("");
  const [dimensionMode, setDimensionMode] =
    useState<DimensionMode>("feet-inches");
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

  // New State for Skin/STC
  const [durability, setDurability] = useState<DurabilityLevel | null>(null);
  const [stc, setSTC] = useState<number | null>(null);

  // New State for Hardware
  const [closure, setClosure] = useState<ClosureType | null>(null);
  const [track, setTrack] = useState<TrackType | null>(null);
  const [bottomSeal, setBottomSeal] = useState<BottomSealType | null>(null);

  // New State for Aesthetics & Extras
  const [finishType, setFinishType] = useState<FinishType | null>(null);
  const [hingeType, setHingeType] = useState<HingeType | null>(null);
  const [trimColor, setTrimColor] = useState<TrimColor | null>(null);
  const [passdoor, setPassdoor] = useState(false);
  const [workSurface, setWorkSurface] = useState(false);
  const [workSurfaceType, setWorkSurfaceType] =
    useState<WorkSurfaceType>("marker_board");

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
  const [isSending, setIsSending] = useState(false);

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
    switch (step) {
      case "dimensions":
        return isDimensionsComplete();
      case "configuration":
        return !!panelConfig;
      case "pocket":
        return !!pocketType;
      case "durability":
        return !!durability;
      case "stc":
        return !!stc;
      case "closure":
        return !!closure;
      case "track":
        return !!track;
      case "bottom_seal":
        return !!bottomSeal;
      case "finish":
        return !!finishType;
      case "hinge_trim":
        return !!hingeType && !!trimColor;
      case "options":
        return visitedSteps.has("options");
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

  const formatDimensionForSummary = (value: DimensionValue) => {
    if (value.mode === "feet-inches") {
      const feet = value.feet || 0;
      const inches = value.inchMain || 0;
      const numerator = value.numerator || 0;
      const denominator = value.denominator || 0;
      const fraction =
        denominator > 0 && numerator > 0 ? ` ${numerator}/${denominator}` : "";
      return `${feet}' ${inches}"${fraction}`.trim();
    }

    if (value.mode === "inches") {
      return `${value.inches || 0} in`;
    }

    return `${value.millimeters || 0} mm`;
  };

  const getUserName = () => {
    return (
      projectInfo.contactPerson.trim() ||
      projectInfo.projectName.trim() ||
      "User"
    );
  };

  const buildJsonPayload = () => {
    return buildOperableJson({
      location,
      width: { ...width, mode: dimensionMode },
      height: { ...height, mode: dimensionMode },
      panelConfig,
      pocketType,
      hasPocketDoor,
      durability,
      stc,
      closure,
      track,
      bottomSeal,
      finishType,
      hingeType,
      trimColor,
      passdoor,
      workSurface,
      workSurfaceType,
      projectInfo,
    });
  };

  const handleRequestQuote = async () => {
    if (!isFormComplete() || !isEmailValid(projectInfo.email)) return;
    if (isSending) return;

    setIsSending(true);
    try {
      const jsonPayload = buildJsonPayload();
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "unreal@vanishingpoint3d.com",
          userName: getUserName(),
          userEmail: projectInfo.email,
          jsonData: jsonPayload,
        }),
      });

      const raw = await response.text();
      let data: { error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        alert(`Error: ${data.error || "Error al enviar el correo"}`);
        return;
      }

      alert("Email enviado con éxito");
    } catch (error) {
      alert("Error al enviar el correo");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadJson = () => {
    if (!isFormComplete() || !isEmailValid(projectInfo.email)) return;
    try {
      const jsonData = buildJsonPayload();
      const fileName = `quote-request-${getUserName()
        .replace(/\s+/g, "-")
        .toLowerCase()}.json`;
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error al generar el archivo JSON");
    }
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
      setCurrentStep("durability");
    } else if (currentStep === "durability") {
      if (!durability) {
        alert("Please select a durability level.");
        return false;
      }
      setCurrentStep("stc");
    } else if (currentStep === "stc") {
      if (!stc) {
        alert("Please select a sound transmission class (STC).");
        return false;
      }
      setCurrentStep("closure");
    } else if (currentStep === "closure") {
      if (!closure) {
        alert("Please select a closure method.");
        return false;
      }
      setCurrentStep("track");
    } else if (currentStep === "track") {
      if (!track) {
        alert("Please confirm the track system.");
        return false;
      }
      setCurrentStep("bottom_seal");
    } else if (currentStep === "bottom_seal") {
      if (!bottomSeal) {
        alert("Please select a bottom seal.");
        return false;
      }
      setCurrentStep("finish");
    } else if (currentStep === "finish") {
      if (!finishType) {
        alert("Please select a finish option.");
        return false;
      }
      setCurrentStep("hinge_trim");
    } else if (currentStep === "hinge_trim") {
      if (!hingeType || !trimColor) {
        alert("Please select hinge type and trim color.");
        return false;
      }
      setCurrentStep("options");
    } else if (currentStep === "options") {
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
    if (currentStep === "durability") setCurrentStep("pocket");
    if (currentStep === "stc") setCurrentStep("durability");
    if (currentStep === "closure") setCurrentStep("stc");
    if (currentStep === "track") setCurrentStep("closure");
    if (currentStep === "bottom_seal") setCurrentStep("track");
    if (currentStep === "finish") setCurrentStep("bottom_seal");
    if (currentStep === "hinge_trim") setCurrentStep("finish");
    if (currentStep === "options") setCurrentStep("hinge_trim");
    if (currentStep === "project_info") setCurrentStep("options");
    if (currentStep === "summary") setCurrentStep("project_info");
  };

  const resetForm = () => {
    setLocation("");
    setDimensionMode("feet-inches");
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
    setDurability(null);
    setSTC(null);
    setClosure(null);
    setTrack(null);
    setBottomSeal(null);
    setFinishType(null);
    setHingeType(null);
    setTrimColor(null);
    setPassdoor(false);
    setWorkSurface(false);
    setWorkSurfaceType("marker_board");
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
    setVisitedSteps(new Set(["dimensions"]));
    setCurrentStep("dimensions");
  };

  const handleDimensionModeChange = (mode: DimensionMode) => {
    setDimensionMode(mode);
    setWidth((prev) => ({ ...prev, mode }));
    setHeight((prev) => ({ ...prev, mode }));
  };

  const renderDimensionInput = (
    label: string,
    value: DimensionValue,
    onChange: (val: DimensionValue) => void,
  ) => {
    const renderInlineRow = (rowLabel: string, control: ReactNode) => (
      <div className="grid grid-cols-[110px_1fr] md:grid-cols-[120px_1fr] items-center gap-2">
        <label className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] text-left whitespace-nowrap">
          {rowLabel}
        </label>
        {control}
      </div>
    );

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm transition-all hover:border-emerald-400/50 group w-full">
        <div className="mb-3 pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold tracking-wide text-slate-700">
            {label}
          </h3>
        </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {dimensionMode === "feet-inches" && (
            <div className="space-y-2">
              {renderInlineRow(
                "Feet",
                <input
                  type="number"
                  value={value.feet ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      mode: dimensionMode,
                      feet: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-mono text-sm"
                  placeholder="0"
                />
              )}

              {renderInlineRow(
                "Inches",
                <input
                  type="number"
                  value={value.inchMain ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      mode: dimensionMode,
                      inchMain: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-mono text-sm"
                  placeholder="0"
                />
              )}

              {renderInlineRow(
                "Fraction",
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <input
                    type="number"
                    value={value.numerator ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...value,
                        mode: dimensionMode,
                        numerator: Number(e.target.value),
                      })
                    }
                    className="bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all w-full font-mono text-sm"
                    placeholder="Num"
                  />
                  <span className="text-slate-400 font-light text-xl">/</span>
                  <input
                    type="number"
                    value={value.denominator ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...value,
                        mode: dimensionMode,
                        denominator: Number(e.target.value),
                      })
                    }
                    className="bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all w-full font-mono text-sm"
                    placeholder="Den"
                  />
                </div>,
              )}
            </div>
          )}

          {dimensionMode === "inches" && (
            <div className="space-y-2">
              {renderInlineRow(
                "Total Inches",
              <input
                type="number"
                step="0.01"
                value={value.inches ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    mode: dimensionMode,
                    inches: Number(e.target.value),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-mono text-sm"
                placeholder="0.00"
              />
              )}
            </div>
          )}

          {dimensionMode === "metric" && (
            <div className="space-y-2">
              {renderInlineRow(
                "Millimeters (mm)",
              <input
                type="number"
                step="0.1"
                value={value.millimeters ?? ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    mode: dimensionMode,
                    millimeters: Number(e.target.value),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-mono text-sm"
                placeholder="0.0"
              />
              )}
            </div>
          )}

          </div>
      </div>
    );
  };

  const renderConfigurationStep = () => {
    const options = [
      {
        id: "paired" as PanelConfig,
        title: "Paired Panel",
        description:
          "Panels are hinged and moved in groups of two. Moves in a straight line. Recommended for small openings.",
        app: "Classrooms, Board Rooms, Hospitality.",
      },
      {
        id: "single" as PanelConfig,
        title: "Single Panel",
        description:
          "Panels move one at a time. Remote storage available. Solves complex layout/storage challenges.",
        app: "Convention Centers, Ballrooms, Auditoriums.",
      },
      {
        id: "single-parallel" as PanelConfig,
        title: "Single Panel Parallel Stack",
        description:
          "Individual panels with parallel stacking capability. Ideal for tight remote storage areas.",
        app: "High-end exhibit halls and complex architectural spaces.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">
            Select Panel Configuration
          </h2>
          <p className="text-slate-600 text-sm">
            Choose the operational mode that best fits your space requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPanelConfig(opt.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                panelConfig === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-lg font-bold ${panelConfig === opt.id ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    panelConfig === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300"
                  }`}
                >
                  {panelConfig === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-2 leading-relaxed">
                {opt.description}
              </p>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">
                  Common Applications
                </span>
                <span className="text-xs text-slate-600 font-medium">
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
        hasDoor: false,
      },
      {
        id: "inside" as PocketType,
        title: "Pocket Inside Room",
        description: "Storage pocket constructed within the room boundaries.",
        hasDoor: false,
      },
      {
        id: "inside" as PocketType,
        title: "Pocket Inside Room - Include Pocket Door",
        description:
          "Storage pocket constructed within the room boundaries. Includes a pocket door.",
        hasDoor: true,
      },
      {
        id: "outside" as PocketType,
        title: "Pocket Outside Room",
        description:
          "Storage pocket constructed outside the room boundaries (remote).",
        hasDoor: false,
      },
      {
        id: "outside" as PocketType,
        title: "Pocket Outside Room - Include Pocket Door",
        description:
          "Storage pocket constructed outside the room boundaries (remote). Includes a pocket door.",
        hasDoor: true,
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">
            Select Storage Condition
          </h2>
          <p className="text-slate-600 text-sm">
            Define how and where the panels will be stored when not in use.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt, index) => (
            <div
              key={`${opt.id}-${opt.hasDoor}-${index}`}
              className={`relative rounded-xl border transition-all ${
                pocketType === opt.id && hasPocketDoor === opt.hasDoor
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <button
                onClick={() => {
                  setPocketType(opt.id);
                  setHasPocketDoor(opt.hasDoor);
                }}
                className="w-full text-left p-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`text-lg font-bold ${pocketType === opt.id && hasPocketDoor === opt.hasDoor ? "text-emerald-600" : "text-slate-700"}`}
                  >
                    {opt.title}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      pocketType === opt.id && hasPocketDoor === opt.hasDoor
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300"
                    }`}
                  >
                    {pocketType === opt.id && hasPocketDoor === opt.hasDoor && (
                      <div className="w-2 h-2 bg-black rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {opt.description}
                </p>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDurabilityStep = () => {
    const options = [
      {
        id: "highest" as DurabilityLevel,
        title: "Highest Durability",
        material: "Welded Steel Panel with Steel Skin",
        description: "Recommended in areas where high abuse is expected.",
        app: "Convention Centers, Hospitality, Banquet Facilities, Educational, Corporate.",
      },
      {
        id: "high" as DurabilityLevel,
        title: "High Durability",
        material: "Medium Density Fiberboard (MDF) faces",
        description: "Recommended for spaces where some abuse is anticipated.",
        app: "Religious Buildings, Banquet Facilities, Schools.",
      },
      {
        id: "standard" as DurabilityLevel,
        title: "Standard Durability",
        material: "Gypsum panel faces",
        description: "Recommended for areas where low abuse is anticipated.",
        app: "Religious Buildings, Private Meeting Areas.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">
            Select Panel Durability
          </h2>
          <p className="text-slate-600 text-sm">
            Choose the material construction based on expected usage intensity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setDurability(opt.id);
                setSTC(null); // Reset STC when durability changes to ensure validity
              }}
              className={`text-left p-3 rounded-xl border transition-all ${
                durability === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-lg font-bold ${durability === opt.id ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    durability === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300"
                  }`}
                >
                  {durability === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <div className="inline-block px-2 py-1 bg-emerald-50 rounded-md text-[10px] font-mono text-emerald-700 mb-2">
                {opt.material}
              </div>
              <p className="text-slate-600 text-sm mb-2 leading-relaxed">
                {opt.description}
              </p>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">
                  Applications
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {opt.app}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSTCStep = () => {
    let stcOptions: number[] = [];
    if (durability === "highest") {
      stcOptions = [56, 54, 52];
    } else {
      stcOptions = [50, 47, 41];
    }

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">
            Sound Transmission Class (STC)
          </h2>
          <p className="text-slate-600 text-sm">
            Select the level of desired speech privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {stcOptions.map((val) => (
            <button
              key={val}
              onClick={() => setSTC(val)}
              className={`relative p-2 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group ${
                stc === val
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                  : "bg-white border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50"
              }`}
            >
              <div
                className={`text-3xl font-black tracking-tighter transition-colors ${stc === val ? "text-emerald-600" : "text-slate-700 group-hover:text-emerald-600"}`}
              >
                {val}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${stc === val ? "text-emerald-700" : "text-slate-500"}`}
              >
                STC Rating
              </span>

              {stc === val && (
                <div className="absolute top-4 right-4 text-emerald-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderClosureStep = () => {
    const options = [
      {
        id: "expandable" as ClosureType,
        title: "Expandable Closure",
        description:
          "Panel is extended/retracted by a removable crank. Provides a tight acoustic seal.",
      },
      {
        id: "hinged" as ClosureType,
        title: "Hinged Closure",
        description:
          "Closure panel is hinged to the wall. Simple and effective for quick access.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">
            Select Closure Method
          </h2>
          <p className="text-slate-600 text-sm">
            Choose how the final panel closes the opening.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setClosure(opt.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                closure === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-lg font-bold ${closure === opt.id ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    closure === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300"
                  }`}
                >
                  {closure === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTrackStep = () => {
    // In a real app, this might be auto-calculated. For now, we simulate selection.
    const options = [
      {
        id: "standard" as TrackType,
        title: "#17 Modernfold Track",
        description:
          "Standard duty aluminum track system for typical panel weights.",
      },
      {
        id: "heavy" as TrackType,
        title: "#14 Heavy Duty Track",
        description:
          "Heavy duty steel track system for larger, heavier panels.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">Track System</h2>
          <p className="text-slate-600 text-sm">
            Select the suspension system suitable for your configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTrack(opt.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                track === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-lg font-bold ${track === opt.id ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    track === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300"
                  }`}
                >
                  {track === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBottomSealStep = () => {
    const options = [
      {
        id: "automatic" as BottomSealType,
        title: "SureSet™ Automatic",
        description:
          "Seal automatically extends when the partition is expanded. No manual operation required.",
      },
      {
        id: "operable" as BottomSealType,
        title: "SureSet™ Manual",
        description:
          "Manually crank-operated seal for maximum acoustic performance and leveling control.",
      },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">Bottom Seal</h2>
          <p className="text-slate-600 text-sm">
            Select the method for sealing the bottom of the panels to the floor.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setBottomSeal(opt.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                bottomSeal === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`text-lg font-bold ${bottomSeal === opt.id ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {opt.title}
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    bottomSeal === opt.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300"
                  }`}
                >
                  {bottomSeal === opt.id && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFinishStep = () => {
    const options = [
      { id: "tba" as FinishType, title: "To Be Advised" },
      { id: "lotus" as FinishType, title: "Lotus" },
      { id: "adrift" as FinishType, title: "Adrift" },
      { id: "reed_arani" as FinishType, title: "Reed (Arani)" },
      { id: "sandalwood" as FinishType, title: "Sandalwood" },
      { id: "veranda" as FinishType, title: "Veranda" },
      { id: "slate" as FinishType, title: "Slate" },
      { id: "pumila_grass" as FinishType, title: "Pumila Grass" },
      { id: "oats" as FinishType, title: "Oats" },
      { id: "prairie" as FinishType, title: "Prairie" },
      { id: "reed_lennon" as FinishType, title: "Reed (Lennon)" },
      { id: "red_oat" as FinishType, title: "Red Oat" },
      { id: "feather_grass" as FinishType, title: "Feather Grass" },
      { id: "canvas" as FinishType, title: "Canvas" },
      { id: "bobbin_weave" as FinishType, title: "Bobbin Weave" },
      { id: "threads" as FinishType, title: "Threads" },
      { id: "common_thread" as FinishType, title: "Common Thread" },
      { id: "quill" as FinishType, title: "Quill" },
      { id: "lustre" as FinishType, title: "Lustre" },
      { id: "white" as FinishType, title: "White" },
      { id: "silver_dust" as FinishType, title: "Silver Dust" },
      { id: "cirrus" as FinishType, title: "Cirrus" },
      { id: "camel_down" as FinishType, title: "Camel Down" },
      { id: "cimmerin" as FinishType, title: "Cimmerin" },
      { id: "carbon" as FinishType, title: "Carbon" },
      { id: "arctic" as FinishType, title: "Arctic" },
      { id: "serenity" as FinishType, title: "Serenity" },
      { id: "grey_pearl" as FinishType, title: "Grey Pearl" },
      { id: "willet" as FinishType, title: "Willet" },
      { id: "windrift" as FinishType, title: "Windrift" },
      { id: "hemp" as FinishType, title: "Hemp" },
      { id: "b_white" as FinishType, title: "B. White" },
      { id: "eggshell" as FinishType, title: "Eggshell" },
      { id: "frost_taupe" as FinishType, title: "Frost Taupe" },
      { id: "aspen" as FinishType, title: "Aspen" },
      { id: "denver" as FinishType, title: "Denver" },
      { id: "black" as FinishType, title: "Black" },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">Panel Finish</h2>
          <p className="text-slate-600 text-sm">
            Select the visual finish for the partition panels.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFinishType(opt.id)}
              className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                finishType === opt.id
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div>
                <h3
                  className={`font-bold ${finishType === opt.id ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {opt.title}
                </h3>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  finishType === opt.id
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300"
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

  const renderHingeTrimStep = () => {
    const hingeOptions = [
      {
        id: "standard" as HingeType,
        title: "Standard Hinge",
        desc: "Visible butt hinges.",
      },
      {
        id: "soss" as HingeType,
        title: "SOSS Invisible",
        desc: "Completely concealed when closed.",
      },
    ];

    const colorOptions = [
      { id: "clear" as TrimColor, title: "Clear Anodized", hex: "#C0C0C0" },
      { id: "bronze" as TrimColor, title: "Bronze", hex: "#CD7F32" },
      { id: "black" as TrimColor, title: "Black", hex: "#000000" },
      { id: "white" as TrimColor, title: "White", hex: "#FFFFFF" },
      { id: "custom" as TrimColor, title: "Custom", hex: "transparent" },
    ];

    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <h2 className="text-xl font-bold text-slate-700 mb-1">Hinge & Trim</h2>
          <p className="text-slate-600 text-sm">
            Customize the hardware appearance.
          </p>
        </div>

        {/* Hinge Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest pl-1">
            Hinge Type
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {hingeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setHingeType(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  hingeType === opt.id
                    ? "bg-emerald-500/10 border-emerald-500"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`font-bold ${hingeType === opt.id ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {opt.title}
                </div>
                <div className="text-slate-600 text-xs mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest pl-1">
            Trim Color
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {colorOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTrimColor(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  trimColor === opt.id
                    ? "bg-emerald-500/10 border-emerald-500"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border border-slate-300 shadow-sm"
                  style={{
                    backgroundColor: opt.hex,
                    backgroundImage:
                      opt.id === "custom"
                        ? "linear-gradient(45deg, #f3ec78, #af4261)"
                        : undefined,
                  }}
                />
                <div
                  className={`font-medium text-sm ${trimColor === opt.id ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {opt.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOptionsStep = () => {
    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">
            Additional Options
          </h2>
          <p className="text-slate-600 text-sm">
            Select whether a passdoor or worksurface is needed.
          </p>
        </div>

        <div className="space-y-2">
          {/* Passdoor */}
          <button
            onClick={() => setPassdoor(!passdoor)}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
              passdoor
                ? "bg-emerald-500/10 border-emerald-500"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <h3
                className={`text-lg font-bold mb-2 ${passdoor ? "text-emerald-600" : "text-slate-700"}`}
              >
                Passdoor
              </h3>
              <ul className="text-slate-600 text-sm space-y-1 list-disc pl-4 marker:text-emerald-500/50">
                <li>ADA Compliant Hardware</li>
                <li>Surface mounted or recessed exit signs</li>
                <li>Door viewer option</li>
                <li>Window option</li>
                <li>Matching or hollow metal construction available</li>
              </ul>
            </div>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all mt-1 ${
                passdoor
                  ? "bg-emerald-500 text-black"
                  : "bg-slate-100 text-transparent"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          {/* Worksurface */}
          <div
            className={`rounded-xl border transition-all overflow-hidden ${
              workSurface
                ? "bg-emerald-500/5 border-emerald-500"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <button
              onClick={() => setWorkSurface(!workSurface)}
              className="w-full text-left p-3 flex items-start justify-between"
            >
              <div>
                <h3
                  className={`text-lg font-bold mb-2 ${workSurface ? "text-emerald-600" : "text-slate-700"}`}
                >
                  Worksurface
                </h3>
                <ul className="text-slate-600 text-sm space-y-1 list-disc pl-4 marker:text-emerald-500/50">
                  <li>Dry Marker Boards or Tack Surfaces</li>
                  <li>4' by 4' or Full Height / Width of Panel</li>
                  <li>Standard file line feature creates continuous surface</li>
                </ul>
              </div>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all mt-1 ${
                  workSurface
                    ? "bg-emerald-500 text-black"
                    : "bg-slate-100 text-transparent"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>

            {/* Sub-options for Worksurface */}
            {workSurface && (
              <div className="px-3 pb-3 pt-2 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setWorkSurfaceType("marker_board")}
                    className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                      workSurfaceType === "marker_board"
                        ? "bg-emerald-500 text-black shadow-lg"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white"
                    }`}
                  >
                    Marker Board
                  </button>
                  <button
                    onClick={() => setWorkSurfaceType("tack_board")}
                    className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                      workSurfaceType === "tack_board"
                        ? "bg-emerald-500 text-black shadow-lg"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white"
                    }`}
                  >
                    Tack Board
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProjectInfoStep = () => {
    return (
      <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
          <h2 className="text-xl font-bold text-slate-700 mb-1">
            Project Information
          </h2>
          <p className="text-slate-600 text-sm">
            Please provide details about the project.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-medium"
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
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
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
                className="w-1/3 bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                placeholder="State"
              />
              <input
                type="text"
                value={projectInfo.zip}
                onChange={(e) =>
                  setProjectInfo({ ...projectInfo, zip: e.target.value })
                }
                className="w-2/3 bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                placeholder="Zip Code"
              />
            </div>
          </div>

          <div className="col-span-2 h-[1px] bg-slate-200 my-2" />

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
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
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
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
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
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
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
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
            />
          </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modernfold-light bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500/30 w-full min-h-full pb-6">
      <div className="flex flex-col w-full">
        {/* Main Content */}
        <div className="w-full relative">
          <div className="w-full max-w-5xl mx-auto px-3 md:px-5 py-3">
            <header className={`${card} mb-4`}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                <div className="h-6 w-2 bg-[color:var(--accent,#10b981)] rounded-sm" />
                <h1 className="text-xl font-black tracking-tight text-slate-700 flex items-baseline gap-2">
                  Design Planner
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {STEP_LABELS[currentStep]}
                  </span>
                </h1>
              </div>

              <div className="flex gap-2 flex-wrap">
                {STEP_ORDER.map((id, idx) => {
                  const isActive = currentStep === id;
                  const currentIndex = STEP_ORDER.indexOf(currentStep);
                  const furthestReachedIndex = Math.max(
                    ...Array.from(visitedSteps).map((step) =>
                      STEP_ORDER.indexOf(step),
                    ),
                  );
                  const isCurrentComplete = isStepComplete(currentStep);
                  const isCompleted =
                    id === "summary"
                      ? currentStep === "summary" && isFormComplete()
                      : isStepComplete(id);
                  const isNextEnabled =
                    idx === furthestReachedIndex + 1 && isCurrentComplete;
                  const isUnlockedByHistory = idx <= furthestReachedIndex;
                  const isDisabled = !(isUnlockedByHistory || isNextEnabled);
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        if (isDisabled) return;
                        goToStep(id);
                      }}
                      aria-current={isActive}
                      disabled={isDisabled}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${isCompleted ? `bg-${ACCENT} text-black` : "bg-white/5 text-slate-500"} ${isNextEnabled && !isActive && !isCompleted ? "ring-1 ring-emerald-400/40 text-emerald-400/80" : ""} ${isActive ? "ring-2 ring-emerald-400/70" : ""} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                      title={`${idx + 1}. ${STEP_LABELS[id]}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </header>

            <section className="space-y-3">
              {currentStep === "dimensions" && (
                <div className="space-y-3">
                  <div className={`${card} w-full`}>
                    <div className="mb-3 pb-2 border-b border-slate-200">
                      <h3 className="text-sm font-bold tracking-wide text-slate-700">
                        Partition Location
                      </h3>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location name"
                        className="w-full bg-white border border-slate-300 rounded-md px-2 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>
                  <div className={`${card} w-full`}>
                    <div className="mb-3 pb-2 border-b border-slate-200">
                      <h3 className="text-sm font-bold tracking-wide text-slate-700">
                        Dimension Unit
                      </h3>
                    </div>
                    <div className="grid grid-flow-col auto-cols-max gap-1 bg-slate-100 p-0.5 rounded-lg w-full border border-slate-200 overflow-x-auto">
                        {(["feet-inches", "inches", "metric"] as DimensionMode[]).map(
                          (mode) => (
                            <button
                              key={mode}
                              onClick={() => handleDimensionModeChange(mode)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide whitespace-nowrap transition-all ${
                                dimensionMode === mode
                                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
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
                  </div>
                  <div className="space-y-3">
                    {renderDimensionInput("Opening Width", width, setWidth)}
                    {renderDimensionInput("Opening Height", height, setHeight)}
                  </div>
                </div>
              )}

              {currentStep === "configuration" && renderConfigurationStep()}

              {currentStep === "pocket" && renderPocketStep()}

              {currentStep === "durability" && renderDurabilityStep()}

              {currentStep === "stc" && renderSTCStep()}

              {currentStep === "closure" && renderClosureStep()}

              {currentStep === "track" && renderTrackStep()}

              {currentStep === "bottom_seal" && renderBottomSealStep()}

              {currentStep === "finish" && renderFinishStep()}

              {currentStep === "hinge_trim" && renderHingeTrimStep()}

              {currentStep === "options" && renderOptionsStep()}

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
                      ? "Here is the summary of your specification."
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
                        {formatDimensionForSummary({
                          ...width,
                          mode: dimensionMode,
                        })}
                      </span>
                      <span className="text-slate-500">Height:</span>{" "}
                      <span className="text-right">
                        {formatDimensionForSummary({
                          ...height,
                          mode: dimensionMode,
                        })}
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
                        Performance
                      </span>
                      <span className="text-slate-500">Durability:</span>{" "}
                      <span className="text-right capitalize">
                        {durability}
                      </span>
                      <span className="text-slate-500">STC Rating:</span>{" "}
                      <span className="text-right">{stc}</span>
                      <span className="text-slate-500">Closure:</span>{" "}
                      <span className="text-right capitalize">{closure}</span>
                      <span className="text-slate-500">Track:</span>{" "}
                      <span className="text-right capitalize">{track}</span>
                      <span className="text-slate-500">Bottom Seal:</span>{" "}
                      <span className="text-right capitalize">
                        {bottomSeal}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/5 pb-4">
                      <span className="text-emerald-400 font-bold col-span-2 text-xs uppercase tracking-wider mb-1">
                        Esthetics & Options
                      </span>
                      <span className="text-slate-500">Finish:</span>{" "}
                      <span className="text-right capitalize">
                        {finishType}
                      </span>
                      <span className="text-slate-500">Hinge:</span>{" "}
                      <span className="text-right capitalize">{hingeType}</span>
                      <span className="text-slate-500">Trim Color:</span>{" "}
                      <span className="text-right capitalize">{trimColor}</span>
                      <span className="text-slate-500">Extras:</span>
                      <div className="text-right flex flex-col">
                        {passdoor && <span>Passdoor</span>}
                        {workSurface && (
                          <span>
                            Worksurface (
                            {workSurfaceType === "marker_board"
                              ? "Marker"
                              : "Tack"}
                            )
                          </span>
                        )}
                        {!passdoor && !workSurface && <span>None</span>}
                      </div>
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
                    </div>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRequestQuote}
                        disabled={
                          !isFormComplete() ||
                          !isEmailValid(projectInfo.email) ||
                          isSending
                        }
                        className={`flex-1 rounded-md py-2 text-sm font-bold transition-all ${
                          isFormComplete() && isEmailValid(projectInfo.email)
                            ? `bg-${ACCENT} text-black`
                            : "bg-white/10 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {isSending ? "Sending..." : "Request a quote"}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadJson}
                        disabled={
                          !isFormComplete() || !isEmailValid(projectInfo.email)
                        }
                        className={`w-10 h-10 rounded-md border flex items-center justify-center transition-all ${
                          isFormComplete() && isEmailValid(projectInfo.email)
                            ? "bg-white/5 border-white/10 hover:border-emerald-500/50"
                            : "bg-white/5 border-white/10 text-slate-500 cursor-not-allowed"
                        }`}
                        title="Download JSON"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 3.75a.75.75 0 01.75.75v8.69l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V4.5a.75.75 0 01.75-.75zm-7.5 13.5a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
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
