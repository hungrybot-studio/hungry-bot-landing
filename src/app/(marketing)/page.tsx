'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/hero';
import { AIVoiceAgent } from '@/components/ai-voice-agent';
import { PainPoints } from '@/components/pain-points';
import { HowItWorks } from '@/components/how-it-works';
import { SocialProof } from '@/components/social-proof';

import { WhatsNext } from '@/components/whats-next';
import { FinalCta } from '@/components/final-cta';
import { Footer } from '@/components/footer';
import { LeadFormModal } from '@/components/lead-form-modal';
import { ResponsiveTest } from '@/components/responsive-test';
import { EnvTest } from '@/components/env-test';
import { parseUTMParams } from '@/lib/utm';

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Parse UTM parameters on page load
  useEffect(() => {
    parseUTMParams();
  }, []);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero onOpenForm={handleOpenForm} />

      {/* AI Voice Agent */}
      <AIVoiceAgent />

      {/* Pain Points */}
      <PainPoints onOpenForm={handleOpenForm} />

      {/* How It Works */}
      <HowItWorks />

      {/* Social Proof */}
      <SocialProof />



      {/* What's Next */}
      <WhatsNext onOpenForm={handleOpenForm} />

      {/* Final CTA */}
      <FinalCta onOpenForm={handleOpenForm} />

      {/* Footer */}
      <Footer />

      {/* Lead Form Modal */}
      <LeadFormModal isOpen={isFormOpen} onClose={handleCloseForm} />
      
      {/* Responsive Test (only in development) */}
      <ResponsiveTest />
      
      {/* Environment Test (only in development) */}
      <EnvTest />
    </main>
  );
}
