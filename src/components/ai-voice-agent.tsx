"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CTAButton } from "./cta-button";

const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL!; // wss://hungry-bot-websocket-server.onrender.com

export default function AIVoiceAgent() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Функція для розблокування аудіо
  async function unlockAudio() {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioContext.resume();
      
      // Створюємо короткий тихий тон для розблокування
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      audioContext.close();
      
      console.log("🔊 Audio unlocked successfully");
    } catch (error) {
      console.error("Failed to unlock audio:", error);
    }
  }

  // Функція для конвертації base64 в Blob URL
  function b64ToBlobUrl(b64: string) {
    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return URL.createObjectURL(new Blob([bin], { type: "audio/mpeg" }));
  }

  // Аудіо черга
  const queue: string[] = [];
  let playing = false;
  
  function enqueue(url: string) { 
    queue.push(url); 
    if (!playing) playNext(); 
  }
  
  function playNext() {
    const url = queue.shift(); 
    if (!url) { 
      playing = false; 
      return; 
    }
    playing = true;
    const a = new Audio(url);
    a.onended = a.onerror = () => { 
      URL.revokeObjectURL(url); 
      playNext(); 
    };
    a.play().catch(() => playNext());
  }

  // Підключення до WebSocket
  const handleConnect = async () => {
    if (isConnected) return;
    
    try {
      await unlockAudio();
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🔌 WebSocket connected");
        setIsConnected(true);
        ws.send(JSON.stringify({ type: "activate_agent" })); // запускаємо агента
      };

      let b64buf = "";
      ws.onmessage = (e) => {
        let msg: any; 
        try { 
          msg = JSON.parse(e.data); 
        } catch (e) { 
          console.error("Failed to parse message:", e);
          return; 
        }

        console.log("📥 Received:", msg.type);

        if (msg.type === "audio" && msg.data) { 
          enqueue(b64ToBlobUrl(msg.data)); 
        }
        
        if (msg.type === "audio_chunk" && typeof msg.data === "string") {
          b64buf += msg.data; 
          if (msg.final) { 
            enqueue(b64ToBlobUrl(b64buf)); 
            b64buf = ""; 
          }
        }
        
        if (msg.type === "agent_speech") {
          console.log("🤖 Agent said:", msg.message);
          setIsAgentActive(true);
        }
        
        if (msg.type === "welcome") {
          console.log("👋 Welcome:", msg.message);
        }
        
        if (msg.type === "error") {
          console.error("❌ Agent error:", msg.message);
          setIsAgentActive(false);
        }
      };

      ws.onclose = () => { 
        console.log("🔌 WebSocket disconnected");
        setIsConnected(false); 
        setIsAgentActive(false);
        wsRef.current = null; 
      };
      
      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setIsConnected(false);
        setIsAgentActive(false);
      };

    } catch (error) {
      console.error("Failed to connect:", error);
      setIsConnected(false);
    }
  };

  // Переривання агента
  const handleInterrupt = () => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({ type: "interrupt" }));
      setIsAgentActive(false);
      console.log("⏹️ Interrupted agent");
    }
  };

  // Очищення при розмонтуванні
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Заголовок */}
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Спитай у Hungry Bot 🤖
          </motion.h2>

          {/* Опис */}
          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Hungry Bot — твій кулінарний AI-асистент! Просто натисни кнопку і почни розмову. 
            Агент сам веде діалог та відповідає на всі твої питання про кухню.
          </motion.p>

          {/* AI Voice Agent Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {!isConnected ? (
              <CTAButton
                onClick={handleConnect}
                variant="primary"
                size="lg"
                location="ai_voice_agent"
                className="mx-auto text-lg px-8 py-4"
              >
                🤖 Запитати Hungry Bot
              </CTAButton>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <CTAButton
                  onClick={handleInterrupt}
                  variant="secondary"
                  size="lg"
                  location="ai_voice_agent_interrupt"
                  className="text-lg px-8 py-4"
                  disabled={!isAgentActive}
                >
                  ⏹️ Перервати агента
                </CTAButton>
                
                <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  {isAgentActive ? "🟢 Агент говорить..." : "🟡 Агент готовий"}
                </div>
              </div>
            )}
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Card 1 */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Асистент</h3>
              <p className="text-gray-600">
                Hungry Bot сам веде діалог та відповідає на всі питання про кухню
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Голосовий інтерфейс</h3>
              <p className="text-gray-600">
                Натуральна мова через ElevenLabs та можливість переривати агента
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🍳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Кулінарна експертиза</h3>
              <p className="text-gray-600">
                Спеціалізується на рецептах, кухонних порадах та кулінарних секретах
              </p>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.p
            className="text-sm text-gray-500 mt-12 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            * Hungry Bot використовує ElevenLabs для натурального голосу та AI для розумних відповідей
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
