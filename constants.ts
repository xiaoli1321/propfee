
import { Department, Staff } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: '住宅一部', color: '#6366f1' },
  { id: 'dept-2', name: '住宅二部', color: '#10b981' },
  { id: 'dept-3', name: '商业运营部', color: '#f59e0b' },
  { id: 'dept-4', name: '特约服务部', color: '#ec4899' },
];

export const INITIAL_STAFF: Staff[] = [
  { id: 's1', name: '张伟', deptId: 'dept-1', collectedAmount: 12500, target: 20000 },
  { id: 's2', name: '李强', deptId: 'dept-1', collectedAmount: 8400, target: 15000 },
  { id: 's3', name: '王丽', deptId: 'dept-1', collectedAmount: 15600, target: 22000 },
  { id: 's4', name: '赵敏', deptId: 'dept-2', collectedAmount: 21000, target: 25000 },
  { id: 's5', name: '孙晨', deptId: 'dept-2', collectedAmount: 18200, target: 20000 },
  { id: 's6', name: '周杰', deptId: 'dept-3', collectedAmount: 45000, target: 50000 },
  { id: 's7', name: '吴磊', deptId: 'dept-3', collectedAmount: 32000, target: 40000 },
  { id: 's8', name: '郑华', deptId: 'dept-4', collectedAmount: 12000, target: 15000 },
  { id: 's9', name: '冯媛', deptId: 'dept-4', collectedAmount: 9800, target: 12000 },
];
