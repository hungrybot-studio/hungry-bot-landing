"use client";
import Script from "next/script";

const AGENT_ID = "agent_6101k3vk48naeaers05d01pzw084";

export default function ElevenLabsAgentWidget() {
  return (
    <>
      {/* Конфіг для віджета: передаємо ID агента у глобальний обʼєкт */}
      <Script id="el-config" strategy="afterInteractive">
        {`window.ElevenLabs = { agentId: "${AGENT_ID}" };`}
      </Script>

      {/* Підключаємо офіційний скрипт віджета */}
      <Script
        src="https://cdn.elevenlabs.io/convai-widget/index.js"
        strategy="afterInteractive"
      />

      {/* Робимо глобальну функцію, яку викличе твоя кнопка */}
      <Script id="hungrybot-open-agent" strategy="afterInteractive">
        {`
          window.hungryBotOpenAgent = function() {
            try {
              if (window.ElevenLabs && typeof window.ElevenLabs.open === 'function') {
                window.ElevenLabs.open();
                return;
              }
              console.warn('Віджет ще не ініціалізувався. Спробуйте за секунду ще раз.');
            } catch (e) { console.error('Open agent error:', e); }
          };
        `}
      </Script>
    </>
  );
}
