"use client";
import Script from "next/script";

const AGENT_ID =
  process.env.NEXT_PUBLIC_ELEVEN_AGENT_ID || "agent_6101k3vk48naeaers05d01pzw084";

export default function ElevenLabsEmbed() {
  return (
    <>
      {/* 1) Рендеримо кастомний тег через HTML, щоб TS не сварився */}
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `<elevenlabs-convai agent-id="${AGENT_ID}"></elevenlabs-convai>`,
        }}
      />

      {/* 2) Підключаємо офіційний скрипт віджета з unpkg (НЕ з cdn.elevenlabs.io) */}
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        async
        type="text/javascript"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("[HungryBot] ElevenLabs embed loaded");
        }}
        onError={() => {
          (window as any).__el_cdn_failed__ = true;
          console.warn("Не вдалося завантажити віджет з unpkg.com");
        }}
      />

      {/* 3) Глобальна функція — відкриває віджет (її викликатиме твоя кнопка) */}
      <Script id="hb-open-agent" strategy="afterInteractive">
        {`
          window.hungryBotOpenAgent = function(){
            try {
              var el = document.querySelector('elevenlabs-convai');
              if (el && typeof el.open === 'function') { el.open(); return; }
              if (window.__el_cdn_failed__) {
                alert('Віджет не завантажився (мережа блокує unpkg.com). Спробуйте іншу мережу або вимкніть блокувальник.');
                return;
              }
              // якщо скрипт ще ініціалізується — спробувати повторно
              setTimeout(window.hungryBotOpenAgent, 300);
            } catch (e) { console.error('Open agent error:', e); }
          };
        `}
      </Script>
    </>
  );
}
