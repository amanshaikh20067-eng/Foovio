import React from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface SimulatedUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeConfirmed: () => void;
}

export const SimulatedUpgradeModal: React.FC<SimulatedUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeConfirmed,
}) => {
  const handleSimulateUpgrade = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1B4332', '#74D481', '#52B788', '#2D6A4F'],
      });
    } catch {
      // fallback
    }
    onUpgradeConfirmed();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Foovio Pro Demo Simulation"
      maxWidth="md"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-forest-600 text-limeAccent-400 flex items-center justify-center mx-auto shadow-glow-green">
          <Sparkles className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <Badge variant="lime" size="md">
            Interactive Presentation Demo
          </Badge>
          <h3 className="text-xl font-black text-charcoal-900 mt-2">
            Simulate Foovio Pro Activation
          </h3>
          <p className="text-xs text-charcoal-600 max-w-sm mx-auto mt-1 leading-relaxed">
            Experience student premium features instantly. This demo unlocks unlimited meal history, advanced meal comparison algorithms, and priority AI recommendations.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-100 text-left space-y-2 text-xs">
          <div className="font-bold text-forest-900 mb-1">What you unlock:</div>
          <div className="flex items-center gap-2 text-forest-800">
            <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
            <span>Side-by-side 3-way combo comparisons</span>
          </div>
          <div className="flex items-center gap-2 text-forest-800">
            <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
            <span>Unlimited meal history & 30-day nutrition analytics</span>
          </div>
          <div className="flex items-center gap-2 text-forest-800">
            <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
            <span>Advanced protein-per-rupee budget optimizer</span>
          </div>
        </div>

        {/* Explicit Simulation Notice */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 text-left flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Simulated Upgrade Only:</strong> No real money will be charged, no payment gateway is connected, and no credit card is required.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button variant="secondary" size="md" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button
            variant="lime"
            size="md"
            onClick={handleSimulateUpgrade}
            icon={<Zap className="w-4 h-4" />}
            className="w-full"
          >
            Activate Pro (Demo Mode)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
