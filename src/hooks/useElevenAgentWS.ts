"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ---- AUDIO OUT (AGENT → PLAYER) ----
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

// PCM16 → WAV (Base64)
function pcm16ToWavBase64(pcmB64: string, sampleRate = 16000, numChannels = 1) {
  const pcmBytes = b64ToBytes(pcmB64);
  const blockAlign = numChannels * 2;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmBytes.length;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  new Uint8Array(buf, headerSize).set(pcmBytes);
  return bytesToB64(new Uint8Array(buf));
}

function detectFormat(b64: string): "mp3" | "wav" | "pcm16" {
  const h = b64.slice(0, 16);
  if (h.startsWith("SUQz") || h.startsWith("/+")) return "mp3"; // ID3 / MP3 frame
  if (h.startsWith("UklG")) return "wav"; // RIFF
  return "pcm16"; // Eleven часто шле сирий PCM16
}

function blobUrlFromBase64(b64: string, mime: string) {
  const bin = b64ToBytes(b64);
  return URL.createObjectURL(new Blob([bin], { type: mime }));
}

function createAudioQueue() {
  const q: string[] = [];
  let playing = false;
  const playNext = () => {
    const url = q.shift();
    if (!url) { playing = false; return; }
    playing = true;
    const a = new Audio(url);
    a.onended = a.onerror = () => { URL.revokeObjectURL(url); playNext(); };
    a.play().catch(() => playNext());
  };
  return { enqueue(url: string) { q.push(url); if (!playing) playNext(); } };
}

// ---- AUDIO IN (MIC → WS; PCM16 16k) ----
function floatTo16BitPCM(f32: Float32Array): Int16Array {
  const out = new Int16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    let s = Math.max(-1, Math.min(1, f32[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return out;
}

function resampleTo16k(input: Float32Array, fromRate: number): Float32Array {
  if (fromRate === 16000) return input;
  const ratio = fromRate / 16000;
  const newLen = Math.round(input.length / ratio);
  const out = new Float32Array(newLen);
  let pos = 0;
  for (let i = 0; i < newLen; i++) {
    const idx = i * ratio;
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, input.length - 1);
    const frac = idx - i0;
    out[i] = input[i0] * (1 - frac) + input[i1] * frac;
  }
  return out;
}

// ---- утиліти аудіо ----
function unlockAudioContextOnce() {
  // Розблокувати автоплей у iOS/Safari/Chrome: тихий «біп» 50 мс
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return Promise.resolve();
    const ctx = new Ctx();
    if (ctx.state === "suspended") return ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    g.gain.value = 0.0001;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.05);
    return Promise.resolve();
  } catch { return Promise.resolve(); }
}







// ---- основний хук ----
export function useElevenAgentWS(agentId: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const workRef = useRef<{ ctx?: AudioContext; node?: ScriptProcessorNode } | null>(null);
  const metaRef = useRef<{ sampleRate: number; channels: number }>({ sampleRate: 16000, channels: 1 });
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<"idle"|"connecting"|"talking">("idle");
  const q = useRef(createAudioQueue());

  // WebAudio функції
  async function startPcmStream(ws: WebSocket, stream: MediaStream) {
    // 1) AudioContext (якщо в Safari ігнорує sampleRate — ми все одно ресемплимо)
    const ACtx = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new ACtx({ sampleRate: 16000 });

    const source = ctx.createMediaStreamSource(stream);
    // bufferSize 2048/4096 — норм; 1 канал моно
    const node = ctx.createScriptProcessor(2048, 1, 1);

    node.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0); // Float32 [-1..1] @ ctx.sampleRate (часто 48k)
      const f32_16k = resampleTo16k(input, ctx.sampleRate);
      const pcm16 = floatTo16BitPCM(f32_16k);
      const b64 = bytesToB64(new Uint8Array(pcm16.buffer));
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ user_audio_chunk: b64 }));
      }
    };

    source.connect(node);
    // щоб node працював стабільно — підʼєднуємо його до destination тихо
    const gain = ctx.createGain();
    gain.gain.value = 0.0; // без звуку
    node.connect(gain).connect(ctx.destination);

    workRef.current = { ctx, node };
  }

  function stopPcmStream() {
    try {
      workRef.current?.node?.disconnect();
      workRef.current?.ctx?.close();
    } catch {}
    workRef.current = null;
  }

     const start = useCallback(async () => {
     if (connected || status === "connecting") return;
     console.log('🚀 Starting ElevenLabs agent connection...');
     setStatus("connecting");

     await unlockAudioContextOnce();

     // 1) Доступ до мікрофона
     console.log('🎤 Requesting microphone access...');
     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
     console.log('✅ Microphone access granted');

     // 2) Відкрити WebSocket напряму до публічного агента
     const url = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`;
     console.log('🔗 Connecting to:', url);
     const ws = new WebSocket(url);

         ws.onopen = async () => {
       console.log('🔗 WebSocket connected to ElevenLabs');
       setConnected(true);
       setStatus("talking");

       // (а) просимо MP3 44.1k/128кбіт як у їх REST-прикладах
       console.log('🎯 Requesting MP3 format from agent...');
       ws.send(JSON.stringify({
         type: "set_response_audio_format",
         response_audio_format: { type: "mp3", sample_rate: 44100, bitrate_bps: 128000 }
       }));

       // (б) ініціалізація діалогу (як і було)
       ws.send(JSON.stringify({ type: "conversation_initiation_client_data" }));

       // (в) стартуємо захоплення мікрофона через WebAudio
       await startPcmStream(ws, stream);
     };

         ws.onmessage = (e) => {
       const msg = JSON.parse(e.data);
       console.log('🔍 WebSocket message received:', msg);

       // Збираємо метадані сесії
       if (msg.type === "conversation_initiation_metadata" && msg.conversation_initiation_metadata_event) {
         const ev = msg.conversation_initiation_metadata_event;
         console.log("🧩 init metadata:", ev);

         // Приклади з логів:
         // agent_output_audio_format: 'pcm_16000'
         // user_input_audio_format:  'pcm_16000'
         const parseHz = (v?: string) => {
           if (typeof v !== "string") return undefined;
           const m = v.match(/(\d{4,6})$/); // витягнути 16000/22050/44100 з кінця
           return m ? parseInt(m[1], 10) : undefined;
         };

         const sr =
           parseHz(ev.agent_output_audio_format) ||
           parseHz(ev.output_audio_format) ||
           Number(ev.sample_rate) ||
           16000;

         const ch =
           Number(ev.channels) ||
           Number(ev.num_channels) ||
           1;

         metaRef.current = { sampleRate: sr, channels: ch };
         console.log("🎛️ Audio config:", metaRef.current);
         return;
       }

       // ping/pong для підтримки зʼєднання
       if (msg.type === "ping" && msg.ping_event?.event_id != null) {
         console.log('🏓 Ping received, sending pong');
         ws.send(JSON.stringify({ type: "pong", event_id: msg.ping_event.event_id }));
         return;
       }

       // основне — аудіо від агента у base64
       if (msg.type === "audio" && msg.audio_event?.audio_base_64) {
         const b64 = msg.audio_event.audio_base_64;

         // детект формату (як у тебе було)
         const fmt = detectFormat(b64);

         if (fmt === "mp3") {
           const url = blobUrlFromBase64(b64, "audio/mpeg");
           console.log('🎵 Playing MP3 audio');
           q.current.enqueue(url);
           return;
         }
         if (fmt === "wav") {
           const url = blobUrlFromBase64(b64, "audio/wav");
           console.log('🎵 Playing WAV audio');
           q.current.enqueue(url);
           return;
         }

         // сирий PCM16 → загортаємо у WAV з ПРАВИЛЬНИМ Hz
         const sr = metaRef.current?.sampleRate || 16000;
         const ch = metaRef.current?.channels || 1;

         const wavB64 = pcm16ToWavBase64(b64, sr, ch);
         const url = blobUrlFromBase64(wavB64, "audio/wav");
         console.log(`🎵 Playing PCM16 as WAV @ ${sr}Hz`);
         q.current.enqueue(url);
         return;
       }

       // текст, який говорить агент
       if (msg.type === "agent_response") {
         console.log('🤖 Agent response:', msg.agent_response_event?.agent_response);
       }

       // що почув від нас
       if (msg.type === "user_transcript") {
         console.log('👤 User transcript:', msg.user_transcription_event?.user_transcript);
       }

       // перевіримо інші типи повідомлень
       if (msg.type === "conversation_initiation_server_data") {
         console.log('✅ Conversation initiated by server');
       }

       if (msg.type === "interruption") {
         console.log('⚠️ Interruption:', msg.interruption_event?.reason);
       }
     };

         ws.onerror = (error) => { 
       console.error('❌ WebSocket error:', error);
     };

     ws.onclose = (event) => {
       console.log('🔌 WebSocket closed:', event.code, event.reason);
       stopPcmStream();
       try { stream.getTracks().forEach(t => t.stop()); } catch {}
       wsRef.current = null;
       setConnected(false);
       setStatus("idle");
     };

    wsRef.current = ws;
  }, [agentId, connected, status]);

  const stop = useCallback(() => {
    stopPcmStream();
    try { wsRef.current?.close(); } catch {}
  }, []);

  useEffect(() => () => {
    stopPcmStream();
    try { wsRef.current?.close(); } catch {}
  }, []);

  return { start, stop, connected, status };
}
