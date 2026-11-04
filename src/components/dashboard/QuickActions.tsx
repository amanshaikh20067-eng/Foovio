import React from 'react';
import { Compass, Camera, MessageSquareCode, PlusCircle } from 'lucide-react';
import { PageRoute } from '../common/Navbar';

interface QuickActionsProps {
  onNavigate: (page: PageRoute) => void;
  onOpenManualLog: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigate,
  onOpenManualLog,
}) => {
  const actions = [
    {
      title: 'Find Next Meal',
      desc: 'Smart 3-way recommendation based on current budget & menu',
      icon: <Compass className="w-5 h-5 text-forest-700" />,
      onClick: () => onNavigate('find-meal'),
      bg: 'bg-forest-50/80 hover:bg-forest-100/90 border-forest-200/80',
      textColor: 'text-forest-900',
    },
    {
      title: 'Scan Food Plate',
      desc: 'Multimodal visual analysis with portion uncertainty check',
      icon: <Camera className="w-5 h-5 text-limeAccent-700" />,
      onClick: () => onNavigate('analyze'),
      bg: 'bg-limeAccent-50/70 hover:bg-limeAccent-100/80 border-limeAccent-200',
      textColor: 'text-forest-900',
    },
    {
      title: 'Ask Foovio',
      desc: 'Compare meals (Poha vs Samosa) & canteen protein tips',
      icon: <MessageSquareCode className="w-5 h-5 text-amber-700" />,
      onClick: () => onNavigate('chat'),
      bg: 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200/80',
      textColor: 'text-amber-950',
    },
    {
      title: 'Log Custom Meal',
      desc: 'Quickly record an off-campus meal or snacks into history',
      icon: <PlusCircle className="w-5 h-5 text-charcoal-700" />,
      onClick: onOpenManualLog,
      bg: 'bg-cream-200/70 hover:bg-cream-300/80 border-charcoal-200',
      textColor: 'text-charcoal-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((act, idx) => (
        <button
          key={idx}
          onClick={act.onClick}
          className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.98] shadow-soft-sm hover:shadow-soft-md ${act.bg}`}
        >
          <div className="p-2.5 rounded-xl bg-white/90 shadow-soft-sm shrink-0 mt-0.5">
            {act.icon}
          </div>
          <div>
            <div className={`text-sm font-bold ${act.textColor}`}>{act.title}</div>
            <div className="text-xs text-charcoal-600 line-clamp-2 mt-0.5 leading-snug">
              {act.desc}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
