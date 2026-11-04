import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SimulatedUpgradeModal } from '../components/premium/SimulatedUpgradeModal';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  Star,
  IndianRupee,
} from 'lucide-react';

interface PremiumPageProps {
  isPro: boolean;
  onUpgradeConfirmed: () => void;
  onDowngradeToFree: () => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({
  isPro,
  onUpgradeConfirmed,
  onDowngradeToFree,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="lime" size="md">
          Student Friendly Pricing
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">
          Supercharge Your Campus Nutrition
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
          Upgrade to Foovio Pro for enhanced meal comparison intelligence, extended nutrition logs, and personalized exam-season meal planning.
        </p>

        {isPro && (
          <div className="p-3.5 rounded-2xl bg-forest-600 text-white text-xs font-bold inline-flex items-center gap-2 shadow-soft-sm">
            <Sparkles className="w-4 h-4 text-limeAccent-400" />
            <span>You are currently in Foovio Pro (Demo Simulation Mode)</span>
          </div>
        )}
      </div>

      {/* Pricing Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <Card
          variant="default"
          className="p-6 sm:p-8 flex flex-col justify-between border-charcoal-300 relative"
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-1">
              Campus Starter
            </div>
            <h3 className="text-2xl font-black text-charcoal-900">Free Tier</h3>
            <div className="my-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-charcoal-900">₹0</span>
              <span className="text-xs text-charcoal-500">/ forever free</span>
            </div>
            <p className="text-xs text-charcoal-600 mb-6">
              Essential canteen meal recommendations and daily allowance tracking for every college student.
            </p>

            <div className="space-y-3 text-xs text-charcoal-700 border-t border-charcoal-100 pt-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                <span>3 Ranked Meal Recommendations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                <span>Basic Indian Nutrition & Macro Estimates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                <span>Sample Food Plate Scanner</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                <span>7-Day Logged Meal History</span>
              </div>
              <div className="flex items-center gap-2.5 text-charcoal-400">
                <XCircle className="w-4 h-4 text-charcoal-300 shrink-0" />
                <span>Side-by-side 3-way meal comparator</span>
              </div>
              <div className="flex items-center gap-2.5 text-charcoal-400">
                <XCircle className="w-4 h-4 text-charcoal-300 shrink-0" />
                <span>Unlimited meal history & 30-day export</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={!isPro}
              onClick={onDowngradeToFree}
            >
              {!isPro ? 'Current Plan' : 'Switch to Free Tier'}
            </Button>
          </div>
        </Card>

        {/* Pro Tier */}
        <Card
          variant="forest"
          className="p-6 sm:p-8 flex flex-col justify-between relative shadow-soft-lg ring-2 ring-limeAccent-400/40"
        >
          <div className="absolute top-4 right-4">
            <Badge variant="lime" size="sm">
              Student Special
            </Badge>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-limeAccent-300 mb-1">
              Hostel Pro Power
            </div>
            <h3 className="text-2xl font-black text-white">Foovio Pro</h3>
            <div className="my-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-limeAccent-400">₹99</span>
              <span className="text-xs text-forest-200">/ month (illustrative)</span>
            </div>
            <p className="text-xs text-forest-100 mb-6">
              Complete nutritional edge: automated macros, side-by-side combo comparator, and priority canteen heuristics.
            </p>

            <div className="space-y-3 text-xs text-forest-50 border-t border-forest-500/70 pt-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limeAccent-300 shrink-0" />
                <span className="font-semibold">All Free Features Included</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limeAccent-300 shrink-0" />
                <span className="font-semibold">Side-by-side 3-Way Combo Comparison Modal</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limeAccent-300 shrink-0" />
                <span className="font-semibold">Unlimited History & Full Month Analytics</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limeAccent-300 shrink-0" />
                <span className="font-semibold">Custom Canteen Food Items & Price Memory</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-limeAccent-300 shrink-0" />
                <span className="font-semibold">Enhanced Gemini 1.5 Multimodal Plate Vision</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button
              variant="lime"
              size="lg"
              className="w-full text-forest-900"
              onClick={() => setIsModalOpen(true)}
              icon={<Sparkles className="w-4 h-4 text-forest-900" />}
            >
              {isPro ? 'Pro Active (Re-test Simulation)' : 'Simulate Pro Upgrade (Demo)'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Illustrative Notice Disclaimer */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Illustrative Concept Notice</div>
          <p className="mt-0.5 leading-relaxed text-amber-800">
            Foovio is built as an academic prototype and hackathon project. Pricing figures shown above are strictly illustrative concepts for campus viability. No payments are collected and no real money will ever be charged.
          </p>
        </div>
      </div>

      {/* Upgrade Simulation Modal */}
      <SimulatedUpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpgradeConfirmed={() => {
          onUpgradeConfirmed();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
