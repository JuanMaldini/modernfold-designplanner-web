import { sendCustomCommand } from "../utils/e3ds-messaging";

function emitCommand(payload: Record<string, string | number | boolean>) {
  sendCustomCommand(payload);
}

export default function Sidepanel() {
  return (
    <div className="bg-red-500 w-full h-full">

      <div>
        <strong>Controls</strong>
      </div>

      <div>
        <div>

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
