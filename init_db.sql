
-- 0. 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, 
  display_name TEXT,
  role TEXT DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1. 创建部门表
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  target_amount DECIMAL DEFAULT 0
);

-- 2. 创建人员表
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  dept_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  collected_amount DECIMAL DEFAULT 0,
  target_amount DECIMAL DEFAULT 0,
  role TEXT
);

-- 3. 创建收费记录表
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id TEXT REFERENCES staff(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  category TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- 4. 插入初始数据
INSERT INTO users (username, password, display_name, role) VALUES
('admin', 'admin123', '系统管理员', 'admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO departments (id, name, color, target_amount) VALUES
('dept-1', '物业一部', '#6366f1', 100000),
('dept-2', '物业二部', '#10b981', 80000),
('dept-3', '商业运营部', '#f59e0b', 120000),
('dept-4', '综合服务部', '#ec4899', 50000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO staff (id, dept_id, name, collected_amount, target_amount, role) VALUES
('s-1', 'dept-1', '张三', 0, 20000, '组长'),
('s-2', 'dept-1', '李四', 0, 15000, '专员'),
('s-3', 'dept-2', '王五', 0, 25000, '主管'),
('s-4', 'dept-3', '赵六', 0, 30000, '经理')
ON CONFLICT (id) DO NOTHING;
