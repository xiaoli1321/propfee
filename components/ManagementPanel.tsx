
import React, { useState } from 'react';
import { Department, Staff } from '../types';
import { Trash2, Edit2, Check, X, Building2, UserPlus, Settings2 } from 'lucide-react';

interface ManagementPanelProps {
  departments: Department[];
  staff: Staff[];
  onRegisterDept: (name: string, color: string) => void;
  onUpdateDept: (id: string, updates: Partial<Department>) => void;
  onDeleteDept: (id: string) => void;
  onRegisterStaff: (name: string, deptId: string, target: number) => void;
  onUpdateStaff: (id: string, updates: Partial<Staff>) => void;
  onDeleteStaff: (id: string) => void;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({ 
  departments, 
  staff,
  onRegisterDept, 
  onUpdateDept,
  onDeleteDept,
  onRegisterStaff,
  onUpdateStaff,
  onDeleteStaff
}) => {
  const [deptName, setDeptName] = useState('');
  const [deptColor, setDeptColor] = useState('#6366f1');
  const [staffName, setStaffName] = useState('');
  const [staffDeptId, setStaffDeptId] = useState('');
  const [staffTarget, setStaffTarget] = useState('');

  // Editing state
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [editDeptName, setEditDeptName] = useState('');
  const [editDeptColor, setEditDeptColor] = useState('');

  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editStaffName, setEditStaffName] = useState('');
  const [editStaffDeptId, setEditStaffDeptId] = useState('');
  const [editStaffTarget, setEditStaffTarget] = useState('');

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

  const startEditDept = (dept: Department) => {
    setEditingDeptId(dept.id);
    setEditDeptName(dept.name);
    setEditDeptColor(dept.color);
  };

  const saveEditDept = () => {
    if (editingDeptId) {
      onUpdateDept(editingDeptId, { name: editDeptName, color: editDeptColor });
      setEditingDeptId(null);
    }
  };

  const startEditStaff = (s: Staff) => {
    setEditingStaffId(s.id);
    setEditStaffName(s.name);
    setEditStaffDeptId(s.deptId);
    setEditStaffTarget(s.target.toString());
  };

  const saveEditStaff = () => {
    if (editingStaffId) {
      onUpdateStaff(editingStaffId, { 
        name: editStaffName, 
        deptId: editStaffDeptId, 
        target: Number(editStaffTarget) 
      });
      setEditingStaffId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Registration */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            新增部门
          </h4>
          <form onSubmit={handleDeptSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="部门名称 (如: 物业一部)"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-sm font-medium text-slate-500">主题色:</label>
              <input 
                type="color" 
                value={deptColor}
                onChange={(e) => setDeptColor(e.target.value)}
                className="w-10 h-6 rounded cursor-pointer border-none bg-transparent"
              />
              <span className="text-xs text-slate-400 font-mono">{deptColor.toUpperCase()}</span>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all">
              确认新增
            </button>
          </form>
        </div>

        {/* Staff Registration */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-500" />
            注册人员
          </h4>
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="人员姓名"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <select 
              value={staffDeptId}
              onChange={(e) => setStaffDeptId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="">选择所属部门</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="本月收费目标 (元)"
              value={staffTarget}
              onChange={(e) => setStaffTarget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold shadow-md shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.98] transition-all">
              确认入职
            </button>
          </form>
        </div>
      </div>

      {/* Lists Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department List */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-500" />
              部门列表管理
            </h4>
            <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200">
              共 {departments.length} 个部门
            </span>
          </div>
          <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
            {departments.map(dept => (
              <div key={dept.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
                {editingDeptId === dept.id ? (
                  <div className="space-y-3">
                    <input 
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 ring-indigo-500/10" 
                      value={editDeptName}
                      onChange={e => setEditDeptName(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <input type="color" value={editDeptColor} onChange={e => setEditDeptColor(e.target.value)} className="w-12 h-6" />
                      <div className="flex gap-2">
                        <button onClick={saveEditDept} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingDeptId(null)} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: dept.color }}></div>
                      <span className="font-semibold text-slate-700">{dept.name}</span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEditDept(dept)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteDept(dept.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-emerald-500" />
              人员列表管理
            </h4>
            <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200">
              共 {staff.length} 名人员
            </span>
          </div>
          <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
            {staff.map(s => {
              const dept = departments.find(d => d.id === s.deptId);
              return (
                <div key={s.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
                  {editingStaffId === s.id ? (
                    <div className="space-y-3">
                      <input 
                        className="w-full px-3 py-1.5 text-sm border rounded-lg" 
                        value={editStaffName}
                        onChange={e => setEditStaffName(e.target.value)}
                      />
                      <select 
                        className="w-full px-3 py-1.5 text-sm border rounded-lg"
                        value={editStaffDeptId}
                        onChange={e => setEditStaffDeptId(e.target.value)}
                      >
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                      <div className="flex items-center justify-between gap-4">
                        <input 
                          type="number"
                          className="w-full px-3 py-1.5 text-sm border rounded-lg"
                          value={editStaffTarget}
                          onChange={e => setEditStaffTarget(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={saveEditStaff} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingStaffId(null)} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 text-sm">{s.name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept?.color }}></span>
                            {dept?.name} · 目标 ¥{s.target}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditStaff(s)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteStaff(s.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
