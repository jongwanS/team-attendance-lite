export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'employee' | 'manager';
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LeaveType = 'annual' | 'half_morning' | 'half_afternoon' | 'sick' | 'other';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  managerId?: string;
  managerName?: string;
  managerMemo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  type: 'work' | 'leave' | 'holiday';
  date: Date;
  userId?: string;
  userName?: string;
  leaveType?: LeaveType;
  isHalfDay?: boolean;
  isHoliday?: boolean;
  holidayName?: string;
}

export interface CalendarView {
  type: 'month' | 'week';
  currentDate: Date;
}

export interface ManagerDashboard {
  pendingRequests: LeaveRequest[];
  teamAvailability: {
    date: Date;
    absentCount: number;
    totalCount: number;
  }[];
} 