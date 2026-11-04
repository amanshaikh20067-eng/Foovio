import React from 'react';
import { PageRoute } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import {
  Compass,
  Sparkles,
  Wallet,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Dumbbell,
  CheckCircle2,
  Clock,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface LandingPageProps {
  onNavigate: (page: PageRoute) => void;
  onTriggerDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onTriggerDemo,
}) => {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-limeAccent-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/90 border border-forest-200 text-forest-800 text-xs font-bold mb-6 animate-subtle-pulse">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>Tailored for Indian Campus Hostels & Canteens</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-charcoal-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Your next meal, <br className="hidden sm:inline" />
          <span className="text-forest-600 underline decoration-limeAccent-400 decoration-wavy decoration-2">
            made smarter.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-charcoal-600 max-w-2xl mx-auto mt-6 leading-relaxed">
          Foovio tells you <em>what to eat right now</em> based on your college canteen menu, remaining pocket money, and nutrition goals.
        </p>

        <div className="text-sm font-extrabold text-forest-700 tracking-wide uppercase mt-2">
          Eat smarter. Spend better.
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 max-w-md mx-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => onNavigate('find-meal')}
            icon={<Compass className="w-5 h-5 text-limeAccent-400" />}
          >
            Find My Meal
          </Button>

          <Button
            variant="lime"
            size="lg"
            className="w-full sm:w-auto"
            onClick={onTriggerDemo}
            icon={<Zap className="w-5 h-5" />}
          >
            Try Interactive Demo
          </Button>
        </div>

        {/* Live Recommendation Preview Mockup */}
        <div className="mt-14 max-w-3xl mx-auto">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-forest-600/20 to-charcoal-200 shadow-soft-lg">
            <div className="bg-white rounded-[22px] p-5 sm:p-7 text-left border border-charcoal-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="forest">Sample Recommendation Preview</Badge>
                    <span className="text-xs text-charcoal-500 font-medium">Lunch Scenario</span>
                  </div>
                  <h3 className="text-lg font-black text-charcoal-900 mt-1">
                    Dal & Rice + 2 Boiled Eggs
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-forest-700">₹85</div>
                  <div className="text-xs text-forest-600 font-semibold">Saves ₹15 from ₹100 budget</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="p-2.5 rounded-xl bg-forest-50 border border-forest-100">
                  <div className="text-[10px] font-bold text-forest-700 uppercase">Protein</div>
                  <div className="text-lg font-black text-forest-900">26g</div>
                </div>
                <div className="p-2.5 rounded-xl bg-cream-200/60 border border-charcoal-100">
                  <div className="text-[10px] font-bold text-charcoal-600 uppercase">Calories</div>
                  <div className="text-lg font-black text-charcoal-900">555 kcal</div>
                </div>
                <div className="p-2.5 rounded-xl bg-cream-200/60 border border-charcoal-100">
                  <div className="text-[10px] font-bold text-charcoal-600 uppercase">Goal Fit</div>
                  <div className="text-lg font-black text-forest-700">96%</div>
                </div>
              </div>

              <p className="text-xs text-charcoal-600 leading-relaxed bg-forest-50/50 p-3 rounded-xl border border-forest-100/70">
                💡 <strong>Why this wins:</strong> Rice and dal supply complete amino acids, while 2 boiled eggs deliver peak protein bioavailability (~₹3.2/g protein) right inside your hostel canteen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="lime" size="sm">Built for Student Life</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 mt-2">
            Why Indian college students need Foovio
          </h2>
          <p className="text-sm text-charcoal-600 mt-2">
            Generic Western apps assume you cook salmon and avocado. Foovio understands hostel canteens, dhabas, and monthly pocket money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900">Real Campus Menus</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Poha, Rajma Rice, Idli Sambar, Paneer Sandwiches, and Boiled Eggs. Select exactly what is available in your college mess today.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-limeAccent-100 text-forest-900 flex items-center justify-center font-bold">
              <Wallet className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900">Student Budget Awareness</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Set your per-meal budget (e.g. ₹60 or ₹100). Every recommendation respects your wallet and calculates exact rupees saved.
            </p>
          </Card>

          <Card variant="elevated" className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
              <Dumbbell className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900">Personalized Goal Fitting</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Target muscle gain, fat loss, or balanced eating. Strict filtering automatically removes allergens and dietary mismatches.
            </p>
          </Card>
        </div>
      </section>

      {/* How it Works (3 Steps) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-cream-200/70 py-14 rounded-3xl border border-charcoal-200/80">
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="forest">Simple 3-Step Flow</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 mt-2">
            How Foovio Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-charcoal-200 space-y-2">
            <div className="text-forest-600 text-xs font-black uppercase tracking-wider">
              Step 01
            </div>
            <h4 className="text-base font-bold text-charcoal-900">Set Budget & Canteen Foods</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Choose your budget (e.g. ₹80) and toggle what the canteen has ready right now.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-charcoal-200 space-y-2">
            <div className="text-forest-600 text-xs font-black uppercase tracking-wider">
              Step 02
            </div>
            <h4 className="text-base font-bold text-charcoal-900">Get 3 Ranked Recommendations</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Our deterministic engine generates Best Overall, Budget-Friendly, and Protein-Focused options.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-charcoal-200 space-y-2">
            <div className="text-forest-600 text-xs font-black uppercase tracking-wider">
              Step 03
            </div>
            <h4 className="text-base font-bold text-charcoal-900">Log & Track Effortlessly</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Tap once to save to your daily history. Monitor 7-day calories and pocket money spent without tedious manual logging.
            </p>
          </div>
        </div>
      </section>

      {/* Competitor Differentiation (Item #9 in Prompt) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="forest">Clear Positioning</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 mt-2">
            How Foovio is Different
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2">
            Understanding the distinction between broad AI chatbots, traditional calorie trackers, and Foovio's practical decision engine.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs bg-white rounded-2xl border border-charcoal-200 shadow-soft-sm overflow-hidden">
            <thead className="bg-cream-100 border-b border-charcoal-200 text-charcoal-900 uppercase font-extrabold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Feature & Focus</th>
                <th className="py-3.5 px-4 text-charcoal-500">General AI Assistants</th>
                <th className="py-3.5 px-4 text-charcoal-500">Traditional Calorie Trackers</th>
                <th className="py-3.5 px-4 text-forest-800 bg-forest-50/80">Foovio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              <tr>
                <td className="py-3 px-4 font-bold text-charcoal-900">Core Purpose</td>
                <td className="py-3 px-4 text-charcoal-600">Broad knowledge answers</td>
                <td className="py-3 px-4 text-charcoal-600">Logging past calories</td>
                <td className="py-3 px-4 font-bold text-forest-800 bg-forest-50/40">
                  Decision support: "What should I eat right now?"
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-charcoal-900">Indian Food Context</td>
                <td className="py-3 px-4 text-charcoal-600">Generic descriptions</td>
                <td className="py-3 px-4 text-charcoal-600">Western meals or crowdsourced entries</td>
                <td className="py-3 px-4 font-bold text-forest-800 bg-forest-50/40">
                  Curated Indian canteen meals (Poha, Rajma, Samosa, Chaas)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-charcoal-900">Budget Constraint (₹)</td>
                <td className="py-3 px-4 text-charcoal-600">Not factored into calculations</td>
                <td className="py-3 px-4 text-charcoal-600">Zero budget integration</td>
                <td className="py-3 px-4 font-bold text-forest-800 bg-forest-50/40">
                  Hard rupee constraint with exact savings tracking
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-charcoal-900">Canteen Availability</td>
                <td className="py-3 px-4 text-charcoal-600">Assumes home cooking or recipes</td>
                <td className="py-3 px-4 text-charcoal-600">Assumes pre-measured portions</td>
                <td className="py-3 px-4 font-bold text-forest-800 bg-forest-50/40">
                  Only recommends meals from active canteen inventory
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-charcoal-900">Offline Reliability</td>
                <td className="py-3 px-4 text-charcoal-600">Fails without active API connection</td>
                <td className="py-3 px-4 text-charcoal-600">Requires cloud sync</td>
                <td className="py-3 px-4 font-bold text-forest-800 bg-forest-50/40">
                  Deterministic local engine works 100% offline
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-forest-600 text-white shadow-soft-lg space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black">
            Ready to eat smarter and spend better?
          </h2>
          <p className="text-sm sm:text-base text-forest-100 max-w-xl mx-auto">
            Test our live demo with Rahul's ₹100 canteen lunch scenario or customize your own student profile now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="lime"
              size="lg"
              onClick={onTriggerDemo}
              icon={<Zap className="w-5 h-5 text-forest-900" />}
            >
              Launch Rahul Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('dashboard')}
              className="border-white text-white hover:bg-forest-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
