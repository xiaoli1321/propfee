
import React from 'react';
import { Department, Staff, FeeEntryRecord } from '../types';
import { StatsCards } from '../components/StatsCards';
import { Sparkles, History } from 'lucide-react';

interface DashboardProps {
  departments: Department[];
  staff: Staff[];
  records: FeeEntryRecord[];
  totalAmount: number;
  totalTarget: number;
  topPerformer: string;
  aiInsight: string;
  isAnalyzing: boolean;
  onRefreshAI: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  departments,
  staff,
  records,
  totalAmount,
  totalTarget,
  topPerformer,
  aiInsight,
  isAnalyzing,
  onRefreshAI
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Metric Cards */}
      <StatsCards 
        totalAmount={totalAmount} 
        totalTarget={totalTarget} 
        topPerformer={topPerformer} 
        staffCount={staff.length} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: AI Insight */}
        <div className="lg:col-span-2">
          <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Sparkles className="w-32 h-32" />
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xl font-bold flex items-center gap-3">
                <div className="bg-indigo-500/30 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-indigo-200" />
                </div>
                AI 智慧运营分析
              </h4>
              <button 
                onClick={onRefreshAI}
                disabled={isAnalyzing}
                className={`p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all ${isAnalyzing ? 'animate-spin' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <div className="text-indigo-50 text-lg leading-relaxed whitespace-pre-wrap">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-10 h-10 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-indigo-200 font-medium">深度学习分析中，请稍候...</p>
                </div>
              ) : (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                   {aiInsight}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activities */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <History className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">最新收缴记录</h4>
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {records.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">暂无录入记录</p>
              </div>
            ) : records.map(record => {
              const s = staff.find(st => st.id === record.staffId);
              const d = departments.find(dept => dept.id === s?.deptId);
              return (
                <div key={record.id} className="flex justify-between items-center p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 hover:bg-slate-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                      {s?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <p className="font-bold text-slate-700">{s?.name}</p>
                         <span className="text-[10px] px-2 py-0.5 rounded-lg text-white font-medium" style={{ backgroundColor: d?.color || '#cbd5e1' }}>
                           {d?.name}
                         </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(record.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-emerald-600 font-extrabold text-lg group-hover:scale-110 transition-transform">+¥{record.amount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
