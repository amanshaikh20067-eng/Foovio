import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { LoggedMeal } from '../../types/history';
import { generateLast7DaysSummaries } from '../../utils/nutrition';
import { formatCalories, formatINR } from '../../utils/formatters';
import { Card } from '../common/Card';
import { BarChart3, TrendingUp, IndianRupee, Flame } from 'lucide-react';

interface WeeklyNutritionChartProps {
  meals: LoggedMeal[];
  dailyCalorieTarget: number;
  dailyBudget: number;
}

export const WeeklyNutritionChart: React.FC<WeeklyNutritionChartProps> = ({
  meals,
  dailyCalorieTarget,
  dailyBudget,
}) => {
  const [activeTab, setActiveTab] = useState<'calories' | 'spending' | 'protein'>('calories');

  const data = generateLast7DaysSummaries(meals);

  return (
    <Card variant="default">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-forest-600" />
            <span>7-Day Student Trends</span>
          </h3>
          <p className="text-xs text-charcoal-500">
            Real tracked calories, protein, and expenditure across the week
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-cream-200 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('calories')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'calories'
                ? 'bg-white text-forest-900 shadow-soft-sm'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Calories
          </button>
          <button
            onClick={() => setActiveTab('protein')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'protein'
                ? 'bg-white text-forest-900 shadow-soft-sm'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Protein (g)
          </button>
          <button
            onClick={() => setActiveTab('spending')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'spending'
                ? 'bg-white text-forest-900 shadow-soft-sm'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Spending (₹)
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'calories' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="dayName" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [`${val} kcal`, 'Calories']}
                labelFormatter={(label) => `Day: ${label}`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="totalCalories" fill="#2D6A4F" radius={[6, 6, 0, 0]} name="Calories" />
            </BarChart>
          ) : activeTab === 'protein' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="dayName" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [`${val}g`, 'Protein']}
                labelFormatter={(label) => `Day: ${label}`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="totalProtein" fill="#52B788" radius={[6, 6, 0, 0]} name="Protein (g)" />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="dayName" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [`₹${val}`, 'Daily Spend']}
                labelFormatter={(label) => `Day: ${label}`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="totalSpent"
                stroke="#1B4332"
                strokeWidth={3}
                dot={{ r: 5, fill: '#74D481', stroke: '#1B4332', strokeWidth: 2 }}
                activeDot={{ r: 7 }}
                name="Total Spent (₹)"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
