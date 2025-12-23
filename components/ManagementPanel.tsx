
import React, { useState } from 'react';
import { Department, Staff } from '../types';

interface ManagementPanelProps {
  departments: Department[];
  onRegisterDept: (name: string, color: string) => void;
  onRegisterStaff: (name: string, deptId: string, target: number) => void;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({ 
  departments, 
  onRegisterDept, 
  onRegisterStaff 
}) => {
  const [deptName, setDeptName] = useState('');
  const [deptColor, setDeptColor] = useState('#6366f1');
  const [staffName, setStaffName] = useState('');
  const [staffDeptId, setStaffDeptId] = useState('');
  const [staffTarget, setStaffTarget] = useState('');

  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName) return;
    onRegisterDept(deptName, deptColor);
    setDeptName('');
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffDeptId || !staffTarget) return;
    onRegisterStaff(staffName, staffDeptId, Number(staffTarget));
    setStaffName('');
    setStaffTarget('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Department Registration */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          新增部门
        </h4>
        <form onSubmit={handleDeptSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="部门名称 (如: 住宅三部)"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-500">主题色:</label>
            <input 
              type="color" 
              value={deptColor}
              onChange={(e) => setDeptColor(e.target.value)}
              className="w-12 h-8 rounded cursor-pointer border-none"
            />
          </div>
          <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-xl font-medium hover:bg-slate-900 transition-colors">
            确认新增
          </button>
        </form>
      </div>

      {/* Staff Registration */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          注册人员
        </h4>
        <form onSubmit={handleStaffSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="人员姓名"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <select 
            value={staffDeptId}
            onChange={(e) => setStaffDeptId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="">分配所属部门</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <input 
            type="number" 
            placeholder="本月收费目标 (元)"
            value={staffTarget}
            onChange={(e) => setStaffTarget(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
            确认入职
          </button>
        </form>
      </div>
    </div>
  );
};
