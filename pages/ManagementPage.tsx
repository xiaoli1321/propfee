
import React from 'react';
import { Department, Staff } from '../types';
import { ManagementPanel } from '../components/ManagementPanel';
import { FeeEntry } from '../components/FeeEntry';
import { Settings, PlusCircle } from 'lucide-react';

interface ManagementPageProps {
  departments: Department[];
  staff: Staff[];
  onAddFee: (staffId: string, amount: number) => Promise<void>;
  onRegisterDept: (name: string, color: string) => Promise<void>;
  onUpdateDept: (id: string, updates: Partial<Department>) => Promise<void>;
  onDeleteDept: (id: string) => Promise<void>;
  onRegisterStaff: (name: string, deptId: string, target: number) => Promise<void>;
  onUpdateStaff: (id: string, updates: Partial<Staff>) => Promise<void>;
  onDeleteStaff: (id: string) => Promise<void>;
}

const ManagementPage: React.FC<ManagementPageProps> = ({
  departments,
  staff,
  onAddFee,
  onRegisterDept,
  onUpdateDept,
  onDeleteDept,
  onRegisterStaff,
  onUpdateStaff,
  onDeleteStaff
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">录入与管理</h2>
          <p className="text-slate-500 mt-1">管理部门架构、人员配置并录入最新收费数据</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">快速录入</h3>
            </div>
            <FeeEntry staff={staff} onAddFee={onAddFee} />
          </div>
        </div>

        {/* Management Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <Settings className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">基础信息维护</h3>
          </div>
          <ManagementPanel 
            departments={departments} 
            staff={staff}
            onRegisterDept={onRegisterDept} 
            onUpdateDept={onUpdateDept}
            onDeleteDept={onDeleteDept}
            onRegisterStaff={onRegisterStaff} 
            onUpdateStaff={onUpdateStaff}
            onDeleteStaff={onDeleteStaff}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
