
import React from 'react';
import { Department, Staff } from '../types';
import { Charts } from '../components/Charts';
import { DepartmentHierarchy } from '../components/DepartmentHierarchy';
import { BarChart3, Network } from 'lucide-react';

interface ChartsPageProps {
  departments: Department[];
  staff: Staff[];
}

const ChartsPage: React.FC<ChartsPageProps> = ({ departments, staff }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">数据可视化</h2>
          <p className="text-slate-500 mt-1">通过图表直观分析各部门与人员的收缴进度</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Hierarchy Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Network className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">组织架构分布</h3>
          </div>
          <DepartmentHierarchy departments={departments} staff={staff} />
        </div>

        {/* Charts Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">业绩对比图表</h3>
          </div>
          <Charts departments={departments} staff={staff} />
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
