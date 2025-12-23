
import React from 'react';
import { Department, Staff } from '../types';

interface DepartmentHierarchyProps {
  departments: Department[];
  staff: Staff[];
}

export const DepartmentHierarchy: React.FC<DepartmentHierarchyProps> = ({ departments, staff }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        部门-人员 实时架构图
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map(dept => {
          const deptStaff = staff.filter(s => s.deptId === dept.id);
          const deptTotal = deptStaff.reduce((acc, s) => acc + s.collectedAmount, 0);
          
          return (
            <div key={dept.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <div 
                className="px-4 py-2 flex justify-between items-center text-white font-bold"
                style={{ backgroundColor: dept.color }}
              >
                <span>{dept.name}</span>
                <span className="text-sm">合计: ¥{deptTotal.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 space-y-2">
                {deptStaff.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2 italic">暂无分配人员</p>
                ) : deptStaff.map(member => {
                  const progress = Math.min((member.collectedAmount / member.target) * 100, 100);
                  return (
                    <div key={member.id} className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-slate-700">{member.name}</span>
                        <span className="text-xs font-medium text-indigo-600">¥{member.collectedAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-400">完成率: {progress.toFixed(0)}%</span>
                        <span className="text-[10px] text-slate-400">目标: ¥{member.target.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
