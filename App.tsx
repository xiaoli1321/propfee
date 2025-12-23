
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Department, Staff, FeeEntryRecord } from './types';
import { StatsCards } from './components/StatsCards';
import { Charts } from './components/Charts';
import { FeeEntry } from './components/FeeEntry';
import { ManagementPanel } from './components/ManagementPanel';
import { DepartmentHierarchy } from './components/DepartmentHierarchy';
import { analyzeFeeData } from './services/geminiService';
import { db } from './services/supabaseService';

const App: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [records, setRecords] = useState<FeeEntryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>('正在分析收缴趋势...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showManagement, setShowManagement] = useState(false);

  // 加载初始数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await db.getDashboardData();
        setDepartments(data.departments);
        setStaff(data.staff);
        setRecords(data.records);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Derived Statistics
  const totalAmount = useMemo(() => staff.reduce((acc, s) => acc + s.collectedAmount, 0), [staff]);
  const totalTarget = useMemo(() => staff.reduce((acc, s) => acc + s.target, 0), [staff]);
  const topPerformer = useMemo(() => {
    const sorted = [...staff].sort((a, b) => b.collectedAmount - a.collectedAmount);
    return sorted[0]?.name || '无';
  }, [staff]);

  const handleAddFee = useCallback(async (staffId: string, amount: number) => {
    try {
      const newRecord = await db.addFeeRecord({ staffId, amount });
      
      // 更新本地状态
      setStaff(prev => prev.map(s => 
        s.id === staffId ? { ...s, collectedAmount: s.collectedAmount + amount } : s
      ));
      setRecords(prev => [newRecord, ...prev]);
    } catch (error) {
      console.error('Failed to add fee:', error);
      alert('保存失败，请检查网络或配置');
    }
  }, []);

  const handleRegisterDept = useCallback(async (name: string, color: string) => {
    try {
      const newDept = await db.registerDept(name, color);
      setDepartments(prev => [...prev, newDept]);
    } catch (error) {
      console.error('Failed to register dept:', error);
    }
  }, []);

  const handleRegisterStaff = useCallback(async (name: string, deptId: string, target: number) => {
    try {
      const newStaff = await db.registerStaff(name, deptId, target);
      setStaff(prev => [...prev, newStaff]);
    } catch (error) {
      console.error('Failed to register staff:', error);
    }
  }, []);

  const refreshAI = useCallback(async () => {
    if (staff.length === 0) return;
    setIsAnalyzing(true);
    const result = await analyzeFeeData({ departments, staff, records });
    setAiInsight(result || '分析暂时不可用');
    setIsAnalyzing(false);
  }, [departments, staff, records]);

  // Initial AI call when data is ready
  useEffect(() => {
    if (!isLoading && staff.length > 0) {
      refreshAI();
    }
  }, [isLoading, staff.length, refreshAI]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">正在加载实时数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PropFee <span className="text-indigo-600">管理看板</span></h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setShowManagement(!showManagement)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                showManagement ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>{showManagement ? '退出管理' : '人员与部门管理'}</span>
            </button>
            <button 
              onClick={refreshAI}
              disabled={isAnalyzing}
              className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${isAnalyzing ? 'animate-spin' : ''}`}
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        {/* Metric Cards */}
        <StatsCards 
          totalAmount={totalAmount} 
          totalTarget={totalTarget} 
          topPerformer={topPerformer} 
          staffCount={staff.length} 
        />

        {showManagement && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
             <ManagementPanel 
               departments={departments} 
               onRegisterDept={handleRegisterDept} 
               onRegisterStaff={handleRegisterStaff} 
             />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <DepartmentHierarchy departments={departments} staff={staff} />
            <Charts departments={departments} staff={staff} />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <FeeEntry staff={staff} onAddFee={handleAddFee} />

            {/* AI Insight Card */}
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl shadow-indigo-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                 </svg>
               </div>
               <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 AI 运营洞察
               </h4>
               <div className="text-indigo-100 text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                 {isAnalyzing ? (
                   <div className="flex items-center gap-2 mt-4">
                     <div className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
                     智慧财务分析中...
                   </div>
                 ) : aiInsight}
               </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="text-lg font-bold text-slate-800 mb-4">最近录入记录</h4>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {records.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">暂无录入记录</p>
                ) : records.map(record => {
                  const s = staff.find(st => st.id === record.staffId);
                  const d = departments.find(dept => dept.id === s?.deptId);
                  return (
                    <div key={record.id} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0 group">
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-semibold text-slate-700">{s?.name}</p>
                           <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: d?.color || '#cbd5e1' }}>
                             {d?.name}
                           </span>
                        </div>
                        <p className="text-xs text-slate-400">{new Date(record.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <span className="text-emerald-600 font-bold group-hover:scale-110 transition-transform">+¥{record.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
