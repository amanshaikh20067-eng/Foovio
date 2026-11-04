import React from 'react';
import { UtensilsCrossed, ShieldAlert, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { PageRoute } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-forest-900 text-cream-100 border-t border-forest-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onNavigate('landing')}
            >
              <div className="w-8 h-8 rounded-lg bg-limeAccent-400 flex items-center justify-center text-forest-900 font-bold">
                <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">Foovio</span>
            </div>
            <p className="text-xs text-forest-200 leading-relaxed">
              AI-Powered Nutrition Assistant engineered specifically for Indian college students living in hostels and eating in campus canteens.
            </p>
            <div className="text-xs font-semibold text-limeAccent-300">
              Eat smarter. Spend better.
            </div>
          </div>

          {/* Quick Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest-300">Features</h4>
            <ul className="space-y-1.5 text-xs text-forest-100">
              <li>
                <button
                  onClick={() => onNavigate('find-meal')}
                  className="hover:text-limeAccent-300 transition-colors"
                >
                  Find My Meal (Recommendation Engine)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analyze')}
                  className="hover:text-limeAccent-300 transition-colors"
                >
                  AI Food Photo Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-limeAccent-300 transition-colors"
                >
                  Meal History & 7-Day Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('chat')}
                  className="hover:text-limeAccent-300 transition-colors"
                >
                  Ask Foovio Canteen Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Indian Campus Nutrition */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest-300">Hostel Focus</h4>
            <ul className="space-y-1.5 text-xs text-forest-100">
              <li>• Real Indian Canteen Menu Items</li>
              <li>• Strict Allergen & Diet Filtering</li>
              <li>• Macro Optimization for Indian Diets</li>
              <li>• Protein per Rupee (₹) Prioritization</li>
              <li>• Complete Offline Local Deterministic Engine</li>
            </ul>
          </div>

          {/* Transparency & Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest-300">Disclaimer</h4>
            <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700 text-[11px] text-forest-200 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-limeAccent-300 mb-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Nutritional Guidance</span>
              </div>
              Foovio provides educational estimates and decision support for students. Calculations are based on standard Indian food composition data and typical campus canteen portion sizes. Not a substitute for clinical medical advice.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-300 gap-3">
          <div className="flex items-center gap-1">
            <span>© 2026 Foovio • Designed for Indian Campus Life</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('premium')}
              className="text-forest-200 hover:text-limeAccent-300 transition-colors"
            >
              Student Pricing
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="text-forest-200 hover:text-limeAccent-300 transition-colors"
            >
              Profile & Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
