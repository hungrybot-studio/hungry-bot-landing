"use client";
import Script from "next/script";

const AGENT_ID = "agent_6101k3vk48naeaers05d01pzw084";

export default function ElevenLabsAgentWidget() {
  return (
    <>
      {/* 1) Конфіг перед скриптом (щоб він бачив agentId під час ініціалізації) */}
      <Script id="el-config" strategy="beforeInteractive">
        {`window.ElevenLabs = { agentId: "${AGENT_ID}" };`}
      </Script>

      {/* 2) Підключаємо офіційний скрипт віджета */}
      <Script
        src="https://cdn.elevenlabs.io/convai-widget/index.js"
        strategy="afterInteractive"
        onLoad={() => { console.log("[HungryBot] ElevenLabs widget loaded"); }}
      />

      {/* 3) Додаємо їхній елемент у DOM (обійдемо TypeScript через HTML-вставку) */}
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `<elevenlabs-convai agent-id="${AGENT_ID}" style="display:none"></elevenlabs-convai>`,
        }}
      />

      {/* 4) Глобальна функція: чекаємо готовність і відкриваємо */}
      <Script id="hungrybot-open-agent" strategy="afterInteractive">
        {`
          window.hungryBotOpenAgent = function() {
            const start = Date.now();
            const tryOpen = () => {
              try {
                if (window.ElevenLabs && typeof window.ElevenLabs.open === 'function') {
                  window.ElevenLabs.open(); return;
                }
                const el = document.querySelector('elevenlabs-convai');
                if (el && typeof el.open === 'function') { el.open(); return; }
              } catch (e) { console.error('Open agent error:', e); return; }
              if (Date.now() - start < 5000) { setTimeout(tryOpen, 100); return; } // чекаємо до 5с
              console.warn('Віджет не встиг ініціалізуватись. Спробуйте ще раз.');
            };
            tryOpen();
          };
        `}
      </Script>
    </>
  );
}
