
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Department, Staff, FeeEntryRecord } from './types';
import { analyzeFeeData } from './services/aiService';
import { db } from './services/supabaseService';

// Layout & Components
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import ChartsPage from './pages/ChartsPage';
import ManagementPage from './pages/ManagementPage';

const App: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [records, setRecords] = useState<FeeEntryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>('正在分析收缴趋势...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  departments={departments}
                  staff={staff}
                  records={records}
                  totalAmount={totalAmount}
                  totalTarget={totalTarget}
                  topPerformer={topPerformer}
                  aiInsight={aiInsight}
                  isAnalyzing={isAnalyzing}
                  onRefreshAI={refreshAI}
                />
              } 
            />
            <Route 
              path="/charts" 
              element={
                <ChartsPage 
                  departments={departments}
                  staff={staff}
                />
              } 
            />
            <Route 
              path="/management" 
              element={
                <ManagementPage 
                  departments={departments}
                  staff={staff}
                  onAddFee={handleAddFee}
                  onRegisterDept={handleRegisterDept}
                  onRegisterStaff={handleRegisterStaff}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-slate-200">
          <div className="text-center text-slate-400 text-sm">
            PropFee Pro © 2025 物业收费实时可视化管理系统
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
