
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
