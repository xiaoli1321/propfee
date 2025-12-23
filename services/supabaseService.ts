
import { createClient } from '@supabase/supabase-js';
import { Department, Staff, FeeEntryRecord } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
  // 获取所有数据并转换为前端格式
  async getDashboardData() {
    const { data: deptsData } = await supabase.from('departments').select('*');
    const { data: staffData } = await supabase.from('staff').select('*');
    const { data: feesData } = await supabase.from('fees').select('*').order('timestamp', { ascending: false });
    
    const departments: Department[] = (deptsData || []).map(d => ({
      id: d.id,
      name: d.name,
      color: d.color
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

  // 保存一条新的收费记录
  async addFeeRecord(record: { staffId: string; amount: number }) {
    // 1. 插入收费记录
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
    
    // 2. 更新人员的累计金额
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

  // 注册新部门
  async registerDept(name: string, color: string) {
    const id = `dept-${Date.now()}`;
    const { data, error } = await supabase
      .from('departments')
      .insert([{ id, name, color }])
      .select()
      .single();
    
    if (error) throw error;
    return { id: data.id, name: data.name, color: data.color };
  },

  // 注册新员工
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
  }
};
