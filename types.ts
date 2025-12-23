
export interface User {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'staff';
}

export interface Staff {
  id: string;
  name: string;
  deptId: string;
  collectedAmount: number;
  target: number;
}

export interface Department {
  id: string;
  name: string;
  color: string;
  targetAmount?: number;
}

export interface FeeEntryRecord {
  id: string;
  staffId: string;
  amount: number;
  timestamp: number;
}

export interface DashboardData {
  departments: Department[];
  staff: Staff[];
  records: FeeEntryRecord[];
}
