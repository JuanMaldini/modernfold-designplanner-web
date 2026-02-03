'use client';
import { useRef, useEffect, useState } from "react";
import Sidepanel from "./sidepanel/Sidepanel";

function E3DSPlayer() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (process.env.PASS_E3DS_URL) {
      setUrl(process.env.PASS_E3DS_URL);
    }

    const iframeElement = iframeRef.current;
    if (!iframeElement) return;

    const handleMessageFromE3DS = (event: MessageEvent) => {
      console.log("[E3DS] Mensaje recibido:", event.data);
    };

    window.addEventListener("message", handleMessageFromE3DS);

    return () => {
      window.removeEventListener("message", handleMessageFromE3DS);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <div className="w-full md:w-3/4 h-1/2 md:h-full">
        <iframe
          ref={iframeRef}
          id="iframe_1"
          src={url}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>

      <div className="w-full md:w-1/4 h-1/2 md:h-full">
        <Sidepanel />
      </div>
    </div>
  );
}

export default E3DSPlayer;