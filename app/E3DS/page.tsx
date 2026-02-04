'use client';
import { useRef, useEffect, useState } from "react";
import Sidepanel from "./sidepanel/Sidepanel";
import '@n8n/chat/dist/style.css';
import Script from "next/script";

function VagonPlayer() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // We keep the env variable name as requested to preserve folder context if needed, 
    // but typically Vagon URLs come from a different source.
    if (process.env.NEXT_PUBLIC_VAGON_STREAM_URL) {
      setUrl(process.env.NEXT_PUBLIC_VAGON_STREAM_URL);
    }
  }, []);

  useEffect(() => {
    // Dynamically import createChat to avoid SSR issues during build
    import('@n8n/chat').then(({ createChat }) => {
      createChat({
        webhookUrl: 'http://localhost:5678/webhook/f4f1ffe0-dee2-472c-90d0-95ffd6919067/chat',
        mode: 'window',
        showWelcomeScreen: true,
        initialMessages: [
          'Do you need guidance to build some steps?'
        ],
        i18n: {
          en: {
            title: 'Hi there! 👋',
            subtitle: "Start a chat. We're here to help you 24/7.",
            footer: '',
            getStarted: 'New Conversation',
            inputPlaceholder: 'Type your question...',
            closeButtonTooltip: 'Close Chat',
          },
        },
      });
    }).catch(err => console.error("Failed to load chat widget", err));
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

      <div className="w-full md:w-1/4 h-1/2 md:h-full">
        <Sidepanel />
      </div>
    </div>
  );
}

export default VagonPlayer;