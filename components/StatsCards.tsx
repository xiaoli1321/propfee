
import React from 'react';

interface StatsCardsProps {
  totalAmount: number;
  totalTarget: number;
  topPerformer: string;
  staffCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ totalAmount, totalTarget, topPerformer, staffCount }) => {
  const completionRate = ((totalAmount / totalTarget) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm font-medium">累计收缴总额</p>
        <h3 className="text-3xl font-bold text-indigo-600 mt-2">¥{totalAmount.toLocaleString()}</h3>
        <p className="text-xs text-slate-400 mt-2">目标 ¥{totalTarget.toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm font-medium">总体完成率</p>
        <h3 className="text-3xl font-bold text-emerald-500 mt-2">{completionRate}%</h3>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm font-medium">最佳收费员</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2 truncate">{topPerformer}</h3>
        <p className="text-xs text-slate-400 mt-2">引领全队收费进程</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm font-medium">活跃收费人员</p>
        <h3 className="text-3xl font-bold text-amber-500 mt-2">{staffCount} 人</h3>
        <p className="text-xs text-slate-400 mt-2">覆盖 4 个核心部门</p>
      </div>
    </div>
  );
};
