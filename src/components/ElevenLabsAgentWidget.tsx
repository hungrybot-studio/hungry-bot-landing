"use client";
import Script from "next/script";
import { useEffect } from "react";

const AGENT_ID = "agent_6101k3vk48naeaers05d01pzw084";

export default function ElevenLabsAgentWidget() {
  return (
    <>
      {/* Підключаємо офіційний віджет */}
      <Script src="https://cdn.elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />

      {/* Вставляємо сам віджет як невидимий елемент (він з'явиться у вигляді бульбашки/вікна) */}
      <elevenlabs-convai agent-id={AGENT_ID} style={{ display: "none" }}></elevenlabs-convai>

      {/* Робимо глобальну функцію, яку викличе твоя кнопка */}
      <Script id="hungrybot-open-agent" strategy="afterInteractive">
        {`
          window.hungryBotOpenAgent = function() {
            try {
              // спосіб 1: якщо віджет надає метод open() через глобальний обʼєкт
              if (window.ElevenLabs && typeof window.ElevenLabs.open === 'function') {
                window.ElevenLabs.open();
                return;
              }
              // спосіб 2: знайти кастомний елемент і викликати open()
              var w = document.querySelector('elevenlabs-convai');
              if (w && typeof w.open === 'function') { w.open(); return; }
              // спосіб 3: клікнути на кнопку віджета, якщо вона в DOM
              var btn = document.querySelector('[data-elevenlabs-open], .elevenlabs-launch, button.elevenlabs-open');
              if (btn) { btn.click(); return; }
              console.warn('Не зміг відкрити віджет: перевірте, що скрипт віджета завантажився');
            } catch (e) { console.error('Open agent error:', e); }
          };
        `}
      </Script>
    </>
  );
}
