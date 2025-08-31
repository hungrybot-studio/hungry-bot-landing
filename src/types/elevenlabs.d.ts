// TypeScript декларація для ElevenLabs віджета
import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Дозволяємо <elevenlabs-convai ...>
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        // основні атрибути, які може приймати віджет
        "agent-id"?: string;
        "project-id"?: string;
        "voice-id"?: string;
        "warm-start"?: string | boolean;
        // запасний варіант — дозволити будь-які інші
        [key: string]: any;
      };
    }
  }

  interface Window {
    hungryBotOpenAgent?: () => void;
    ElevenLabs?: {
      open?: () => void;
      agentId?: string;
    };
  }
}

export {};
