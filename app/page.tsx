"use client";
import { useRef, useEffect, useState } from "react";
import Sidepanel from "./design-planner/sidepanel/Sidepanel";
import Script from "next/script";

function VagonPlayer() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VAGON_STREAM_URL) {
      setUrl(process.env.NEXT_PUBLIC_VAGON_STREAM_URL);
    }
  }, []);


  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <Script
        src="https://streams.vagon.io/sdk/v1/vagon.js"
        strategy="beforeInteractive"
      />

      <div className="w-full md:w-3/4 h-1/2 md:h-full">
        <iframe
          ref={iframeRef}
          id="vagon-iframe"
          src={url}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>

      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <Sidepanel />
      </div>
    </div>
  );
}

export default VagonPlayer;
