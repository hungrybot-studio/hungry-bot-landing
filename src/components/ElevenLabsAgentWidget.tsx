"use client";
import Script from "next/script";

const AGENT_ID = "agent_6101k3vk48naeaers05d01pzw084";

export default function ElevenLabsAgentWidget() {

  return (
    <>
      {/* 1) Конфігурація віджета */}
      <Script id="el-config" strategy="afterInteractive">
        {`window.ElevenLabs = { agentId: "${AGENT_ID}" };`}
      </Script>

      {/* 2) Підключаємо офіційний скрипт віджета */}
      <Script src="https://cdn.elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />

      {/* Сам віджет як кастомний елемент */}
      {/* Завдяки файлу types/elevenlabs.d.ts TypeScript більше не свариться */}
      <elevenlabs-convai agent-id={AGENT_ID} style={{ display: "none" }} />

      {/* Робимо глобальну функцію, яку викличе твоя кнопка */}
      <Script id="hungrybot-open-agent" strategy="afterInteractive">
        {`
          window.hungryBotOpenAgent = function() {
            try {
              // Варіант А: глобальний API віджета
              if (window.ElevenLabs && typeof window.ElevenLabs.open === 'function') {
                window.ElevenLabs.open();
                return;
              }
              // Варіант Б: метод open() на самому елементі
              var el = document.querySelector('elevenlabs-convai');
              if (el && typeof el.open === 'function') { el.open(); return; }
              // Варіант В: тригеримо кнопку, яку вставляє віджет
              var btn = document.querySelector('[data-elevenlabs-open], .elevenlabs-launch, button.elevenlabs-open');
              if (btn) { btn.click(); return; }
              console.warn('Не знайшов як відкрити віджет. Перевір, що скрипт віджета завантажився.');
            } catch (e) { console.error('Open agent error:', e); }
          };
        `}
      </Script>
    </>
  );
}
