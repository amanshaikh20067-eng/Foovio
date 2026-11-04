import React, { useState } from 'react';
import {
  UtensilsCrossed,
  LayoutDashboard,
  Compass,
  Camera,
  History,
  MessageSquareCode,
  Sparkles,
  Settings,
  Menu,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export type PageRoute =
  | 'landing'
  | 'dashboard'
  | 'find-meal'
  | 'analyze'
  | 'history'
  | 'chat'
  | 'premium'
  | 'settings';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onTriggerDemo: () => void;
  userName?: string;
  isPro?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onTriggerDemo,
  userName = 'Rahul',
  isPro = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PageRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'find-meal', label: 'Find My Meal', icon: <Compass className="w-4 h-4" /> },
    { id: 'analyze', label: 'Scan Food', icon: <Camera className="w-4 h-4" /> },
    { id: 'history', label: 'Meal Log', icon: <History className="w-4 h-4" /> },
    { id: 'chat', label: 'Ask Foovio', icon: <MessageSquareCode className="w-4 h-4" /> },
  ];

  const handleLinkClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-cream-100/90 backdrop-blur-md border-b border-charcoal-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => handleLinkClick('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center text-limeAccent-400 shadow-soft-sm group-hover:scale-105 transition-transform duration-200">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-forest-900">
                  Foovio
                </span>
                {isPro && (
                  <Badge variant="lime" size="sm">
                    PRO
                  </Badge>
                )}
              </div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-forest-600 -mt-1 hidden sm:block">
                Eat Smarter • Spend Better
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-forest-600 text-white shadow-soft-sm'
                      : 'text-charcoal-700 hover:text-forest-900 hover:bg-cream-200/80'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={onTriggerDemo}
              title="Loads Rahul demo profile & canteen scenario"
              className="border-dashed hover:border-forest-600"
            >
              Demo Reset
            </Button>

            <button
              onClick={() => handleLinkClick('premium')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-limeAccent-100 hover:bg-limeAccent-200 text-forest-900 border border-limeAccent-300 transition-colors shadow-soft-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-limeAccent-600" />
              <span>Pro Plan</span>
            </button>

            <button
              onClick={() => handleLinkClick('settings')}
              className={`p-2 rounded-xl transition-colors ${
                currentPage === 'settings'
                  ? 'bg-forest-100 text-forest-800'
                  : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200'
              }`}
              title="Settings & Profile"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleLinkClick('settings')}
              className="p-2 text-charcoal-700 hover:bg-cream-200 rounded-lg"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-800 hover:bg-cream-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-charcoal-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-2 shadow-soft-md animate-in slide-in-from-top-4 duration-200">
          <div className="text-xs font-semibold text-charcoal-500 uppercase px-3 py-1">
            Navigation
          </div>
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-forest-600 text-white'
                    : 'text-charcoal-800 hover:bg-cream-200'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-charcoal-100 space-y-2">
            <Button
              variant="lime"
              size="md"
              className="w-full justify-center"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => {
                onTriggerDemo();
                setMobileMenuOpen(false);
              }}
            >
              Reset to Rahul (Demo Mode)
            </Button>
            <button
              onClick={() => handleLinkClick('premium')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-limeAccent-100 text-forest-900 border border-limeAccent-300"
            >
              <Sparkles className="w-4 h-4 text-forest-700" />
              <span>Explore Foovio Pro (₹99/mo)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
