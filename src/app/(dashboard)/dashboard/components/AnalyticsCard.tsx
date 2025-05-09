import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsCardProps {
  events: {
    id: string;
    title: string;
    participants: { emailed: boolean }[];
  }[];
  stats: any;
  loadingEvents: boolean;
  isDarkMode: boolean;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ events, loadingEvents }) => {
  const [activeTab, setActiveTab] = useState("week");
  
  const completionData = events.map((event) => {
    const total = event.participants.length;
    const completed = event.participants.filter(p => p.emailed).length;
    return {
      name: event.title,
      value: total > 0 ? Math.round(completed / total * 100) : 0
    };
  });

  const emailData = events.map((event) => {
    const total = event.participants.length;
    const sent = event.participants.filter(p => p.emailed).length;
    return {
      name: event.title,
      value: total > 0 ? Math.round(sent / total * 100) : 0
    };
  });

  return (
    <motion.div
      className="bg-[var(--dark-onyx)] rounded-2xl p-5  shadow-md border border-[var(--dark-onyx-text)] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-[var(--tealy-heading) underline decoration-2 underline-offset-4 decoration-1]">Analytics</h2>
        

      </div>

      <div className="space-y-6 px-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Event Completion Rate</h3>
            <span className="text-xs text-[var(--text-secondary)]">% Avg</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-4">Certificate completion rates per event</p>
          
          <div className="h-[180px]">
            {loadingEvents ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} barSize={30}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-secondary)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '0.375rem',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#048a91"
                    radius={[4, 4, 0, 0]}
                    label={{ 
                      position: 'top', 
                      fill: '#F4D6CC',
                      fontSize: 12,
                      formatter: (v) => `${v}%` 
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-[var(--text-primary)]">Email Delivery Success</h3>
            <span className="text-xs text-[var(--text-secondary)]">50% Avg</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-4">Successful email delivery rates by event date</p>
          
          <div className="h-[180px]">
            {loadingEvents ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emailData}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-secondary)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '0.375rem',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#048a91"
                    strokeWidth={3}
                    dot={{ r: 5, stroke: '#093552', strokeWidth: 2, fill: '#ffffff' }}
                    activeDot={{ r: 7 }}
                    isAnimationActive={true}
                    label={{
                      position: 'top',
                      fill: '#c5c3c4',
                      fontSize: 12,
                      formatter: (v) => `${v}%`
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;