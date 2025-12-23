
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Department, Staff, FeeEntryRecord, User } from './types';
import { analyzeFeeData } from './services/aiService';
import { db } from './services/supabaseService';

// Layout & Components
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import ChartsPage from './pages/ChartsPage';
import ManagementPage from './pages/ManagementPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(db.getCurrentUser());
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [records, setRecords] = useState<FeeEntryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>('正在分析收缴趋势...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 加载初始数据
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

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
  }, [user]);

  // Derived Statistics
  const totalAmount = useMemo(() => staff.reduce((acc, s) => acc + s.collectedAmount, 0), [staff]);
  const totalTarget = useMemo(() => staff.reduce((acc, s) => acc + s.target, 0), [staff]);
  const topPerformer = useMemo(() => {
    const sorted = [...staff].sort((a, b) => b.collectedAmount - a.collectedAmount);
    return sorted[0]?.name || '无';
  }, [staff]);

  // --- CRUD Handlers ---
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

  const handleUpdateDept = useCallback(async (id: string, updates: Partial<Department>) => {
    try {
      const updated = await db.updateDept(id, updates);
      setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
    } catch (error) {
      console.error('Failed to update dept:', error);
    }
  }, []);

  const handleDeleteDept = useCallback(async (id: string) => {
    if (!window.confirm('确定要删除该部门吗？所属人员将失去部门关联。')) return;
    try {
      await db.deleteDept(id);
      setDepartments(prev => prev.filter(d => d.id !== id));
      setStaff(prev => prev.map(s => s.deptId === id ? { ...s, deptId: '' } : s));
    } catch (error) {
      console.error('Failed to delete dept:', error);
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

  const handleUpdateStaff = useCallback(async (id: string, updates: Partial<Staff>) => {
    try {
      const updated = await db.updateStaff(id, updates);
      setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    } catch (error) {
      console.error('Failed to update staff:', error);
    }
  }, []);

  const handleDeleteStaff = useCallback(async (id: string) => {
    if (!window.confirm('确定要注销该人员吗？其收费记录将同步删除。')) return;
    try {
      await db.deleteStaff(id);
      setStaff(prev => prev.filter(s => s.id !== id));
      setRecords(prev => prev.filter(r => r.staffId !== id));
    } catch (error) {
      console.error('Failed to delete staff:', error);
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
    if (!isLoading && staff.length > 0 && user) {
      refreshAI();
    }
  }, [isLoading, staff.length, refreshAI, user]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
  };

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

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar user={user} onLogout={handleLogout} />
        
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
                  onUpdateDept={handleUpdateDept}
                  onDeleteDept={handleDeleteDept}
                  onRegisterStaff={handleRegisterStaff}
                  onUpdateStaff={handleUpdateStaff}
                  onDeleteStaff={handleDeleteStaff}
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
