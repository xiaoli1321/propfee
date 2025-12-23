
import { createClient } from '@supabase/supabase-js';
import { Department, Staff, FeeEntryRecord, User } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing! Check your environment variables.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

export const db = {
  // --- 用户相关 ---
  async login(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
    
    if (error || !data) return null;
    
    const user: User = {
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      role: data.role as 'admin' | 'staff'
    };
    
    // 存入本地存储
    localStorage.setItem('propfee_user', JSON.stringify(user));
    return user;
  },

  getCurrentUser(): User | null {
    const saved = localStorage.getItem('propfee_user');
    return saved ? JSON.parse(saved) : null;
  },

  logout() {
    localStorage.removeItem('propfee_user');
  },

  // --- 基础数据获取 ---
  async getDashboardData() {
    const { data: deptsData } = await supabase.from('departments').select('*');
    const { data: staffData } = await supabase.from('staff').select('*');
    const { data: feesData } = await supabase.from('fees').select('*').order('timestamp', { ascending: false });
    
    const departments: Department[] = (deptsData || []).map(d => ({
      id: d.id,
      name: d.name,
      color: d.color,
      targetAmount: Number(d.target_amount || 0)
    }));

    const staff: Staff[] = (staffData || []).map(s => ({
      id: s.id,
      name: s.name,
      deptId: s.dept_id,
      collectedAmount: Number(s.collected_amount),
      target: Number(s.target_amount || 0)
    }));

    const records: FeeEntryRecord[] = (feesData || []).map(f => ({
      id: f.id,
      staffId: f.staff_id,
      amount: Number(f.amount),
      timestamp: new Date(f.timestamp).getTime()
    }));
    
    return { departments, staff, records };
  },

  // --- 收费记录 ---
  async addFeeRecord(record: { staffId: string; amount: number }) {
    const { data, error } = await supabase
      .from('fees')
      .insert([{
        staff_id: record.staffId,
        amount: record.amount,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    const { data: staffMember, error: fetchError } = await supabase
      .from('staff')
      .select('collected_amount')
      .eq('id', record.staffId)
      .single();
    
    if (fetchError) throw fetchError;

    const newAmount = Number(staffMember.collected_amount) + record.amount;
    
    const { error: updateError } = await supabase
      .from('staff')
      .update({ collected_amount: newAmount })
      .eq('id', record.staffId);
    
    if (updateError) throw updateError;
    
    return {
      id: data.id,
      staffId: data.staff_id,
      amount: Number(data.amount),
      timestamp: new Date(data.timestamp).getTime()
    };
  },

  // --- 部门管理 ---
  async registerDept(name: string, color: string, targetAmount: number = 0) {
    const id = `dept-${Date.now()}`;
    const { data, error } = await supabase
      .from('departments')
      .insert([{ id, name, color, target_amount: targetAmount }])
      .select()
      .single();
    
    if (error) throw error;
    return { id: data.id, name: data.name, color: data.color, targetAmount: Number(data.target_amount) };
  },

  async updateDept(id: string, updates: Partial<Department>) {
    const { data, error } = await supabase
      .from('departments')
      .update({
        name: updates.name,
        color: updates.color,
        target_amount: updates.targetAmount
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { id: data.id, name: data.name, color: data.color, targetAmount: Number(data.target_amount) };
  },

  async deleteDept(id: string) {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // --- 人员管理 ---
  async registerStaff(name: string, deptId: string, target: number) {
    const id = `s-${Date.now()}`;
    const { data, error } = await supabase
      .from('staff')
      .insert([{ 
        id, 
        name, 
        dept_id: deptId, 
        target_amount: target,
        collected_amount: 0 
      }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      deptId: data.dept_id,
      collectedAmount: 0,
      target: Number(data.target_amount)
    };
  },

  async updateStaff(id: string, updates: Partial<Staff>) {
    const { data, error } = await supabase
      .from('staff')
      .update({
        name: updates.name,
        dept_id: updates.deptId,
        target_amount: updates.target
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      deptId: data.dept_id,
      collectedAmount: Number(data.collected_amount),
      target: Number(data.target_amount)
    };
  },

  async deleteStaff(id: string) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
