import "./Sidepanel.css";

import { sendCustomCommand } from "../E3DS/utils/e3ds-messaging";

function emitCommand(payload: Record<string, string | number | boolean>) {
  sendCustomCommand(payload);
}

export default function Sidepanel() {
  return (
    <div className="sp-panel">
      <div className="sp-header">
        <strong className="sp-title">Controls</strong>
      </div>

      <div className="sp-body" id="sp-body">
        <div className="sp-actions">

          <button
            type="button"
            className="sp-action-btn"
            onClick={() => emitCommand({ Video: "Play" })}
            title={"Play / Stop — payload: Video: Play"}>
            <span className="sp-action-label">Confirm</span>
          </button>

        </div>
      </div>
    </div>
  );
}
