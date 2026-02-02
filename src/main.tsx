import { createRoot } from "react-dom/client";
import DesignPlanner from "./pages/DesignPlanner/designplanner";

createRoot(document.getElementById("root") as HTMLElement).render(
  <DesignPlanner />,
);
