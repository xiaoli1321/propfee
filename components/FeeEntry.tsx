
import React, { useState } from 'react';
import { Staff } from '../types';

interface FeeEntryProps {
  staff: Staff[];
  onAddFee: (staffId: string, amount: number) => void;
}

export const FeeEntry: React.FC<FeeEntryProps> = ({ staff, onAddFee }) => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !amount || isNaN(Number(amount))) return;
    onAddFee(selectedStaff, Number(amount));
    setAmount('');
    // Optionally alert success or use a toast
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
      <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
        快捷收费录入
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">收费人员</label>
          <select 
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="">请选择人员</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">今日收缴金额 (元)</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
        >
          提交今日录入
        </button>
      </form>
    </div>
  );
};
