import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 이전 달의 마지막 날짜들 추가
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    dates.push(new Date(year, month, -i));
  }
  
  // 현재 달의 날짜들 추가
  for (let day = 1; day <= lastDay.getDate(); day++) {
    dates.push(new Date(year, month, day));
  }
  
  // 다음 달의 첫 날짜들 추가
  const lastDayOfWeek = lastDay.getDay();
  for (let day = 1; day < 7 - lastDayOfWeek; day++) {
    dates.push(new Date(year, month + 1, day));
  }
  
  return dates;
}

export function getWeekDates(date: Date): Date[] {
  const week: Date[] = [];
  const current = new Date(date);
  const weekStart = new Date(current);
  weekStart.setDate(current.getDate() - current.getDay());
  
  for (let i = 0; i < 7; i++) {
    week.push(new Date(weekStart));
    weekStart.setDate(weekStart.getDate() + 1);
  }
  
  return week;
}

export function getLeaveTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    annual: '연차',
    half_morning: '오전 반차',
    half_afternoon: '오후 반차',
    sick: '병가',
    other: '기타',
  };
  return labels[type] || type;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
} 