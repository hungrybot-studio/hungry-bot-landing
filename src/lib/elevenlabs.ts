import { env } from './env';

export interface VoiceSession {
  sessionId: string;
  isActive: boolean;
}

export interface VoiceResponse {
  audioUrl: string;
  text: string;
  sessionId: string;
}

// Placeholder implementation - replace with actual ElevenLabs API calls
export class ElevenLabsVoiceAgent {
  private sessionId: string | null = null;

  async startSession(): Promise<VoiceSession> {
    if (!env.NEXT_PUBLIC_ENABLE_ELEVENLABS_AGENT) {
      throw new Error('ElevenLabs agent is not enabled');
    }

    // Placeholder - replace with actual API call
    this.sessionId = `session_${Date.now()}`;
    
    return {
      sessionId: this.sessionId,
      isActive: true,
    };
  }

  async askQuestion(text: string): Promise<VoiceResponse> {
    if (!this.sessionId) {
      throw new Error('No active session. Call startSession() first.');
    }

    if (!env.NEXT_PUBLIC_ENABLE_ELEVENLABS_AGENT) {
      throw new Error('ElevenLabs agent is not enabled');
    }

    // Placeholder - replace with actual API call
    // This should make a request to ElevenLabs API for voice synthesis
    const audioUrl = `/audio/faq-${text.toLowerCase().replace(/\s+/g, '-')}.mp3`;
    
    return {
      audioUrl,
      text: `Відповідь на: ${text}`,
      sessionId: this.sessionId,
    };
  }

  async endSession(): Promise<void> {
    if (!this.sessionId) {
      return;
    }

    // Placeholder - replace with actual API call to close session
    this.sessionId = null;
  }

  isSessionActive(): boolean {
    return this.sessionId !== null;
  }
}

// Singleton instance
export const voiceAgent = new ElevenLabsVoiceAgent();

// Utility functions
export async function startVoiceSession(): Promise<VoiceSession> {
  return voiceAgent.startSession();
}

export async function askVoiceQuestion(text: string): Promise<VoiceResponse> {
  return voiceAgent.askQuestion(text);
}

export async function endVoiceSession(): Promise<void> {
  return voiceAgent.endSession();
}

export function isVoiceAgentEnabled(): boolean {
  return env.NEXT_PUBLIC_ENABLE_ELEVENLABS_AGENT;
}
