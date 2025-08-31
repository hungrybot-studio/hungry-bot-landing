'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';
import { AudioPlayer } from './audio-player';

export function VoiceTeaser() {
  const [isPlaying, setIsPlaying] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Header */}
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Послухай Hungry Bot{' '}
            <span className="text-gradient">👂</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ось як звучить твій майбутній кулінарний помічник. 
            Живий голос, особистість і навіть трохи гумору в кожній відповіді.
          </motion.p>

          {/* Audio Player */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <AudioPlayer
              src="/audio/teaser.mp3"
              onPlay={handlePlayAudio}
              onEnded={handleAudioEnd}
              className="mx-auto"
            />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CTAButton
              onClick={handlePlayAudio}
              variant="primary"
              size="lg"
              location="voice_teaser"
              className="mx-auto"
            >
              🎧 Почути голос Бота
            </CTAButton>
          </motion.div>

          {/* Additional info */}
          <motion.p
            className="text-sm text-gray-500 mt-8 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            * Це демо-версія. Реальний бот буде ще кращим!
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
