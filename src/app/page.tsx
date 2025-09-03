'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { formatDate, getDaysInMonth, getWeekDates } from '@/lib/utils';
import { CalendarEvent, LeaveRequest, LeaveType } from '@/types';

export default function HomePage() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // 더미 데이터 (Firebase 연동 전까지 사용)
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      type: 'leave',
      date: new Date(2024, 11, 15),
      userId: 'user1',
      userName: '김철수',
      leaveType: 'annual',
      isHalfDay: false,
    },
    {
      id: '2',
      type: 'leave',
      date: new Date(2024, 11, 20),
      userId: 'user2',
      userName: '이영희',
      leaveType: 'half_morning',
      isHalfDay: true,
    },
    {
      id: '3',
      type: 'leave',
      date: new Date(2024, 11, 25),
      userId: 'user3',
      userName: '박민수',
      leaveType: 'sick',
      isHalfDay: false,
    },
  ];

  const mockLeaveRequests: LeaveRequest[] = [
    {
      id: '1',
      userId: 'user1',
      userName: '김철수',
      type: 'annual',
      startDate: new Date(2024, 11, 15),
      endDate: new Date(2024, 11, 15),
      reason: '개인 휴가',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'user2',
      userName: '이영희',
      type: 'half_morning',
      startDate: new Date(2024, 11, 20),
      endDate: new Date(2024, 11, 20),
      reason: '병원 진료',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Attendance Lite</h1>
            <p className="text-gray-600 mb-8">사내 소규모 팀을 위한 근태 관리 시스템</p>
            
            <Button 
              onClick={signInWithGoogle}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium"
            >
              Google 계정으로 로그인
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              팀 근태를 효율적으로 관리하세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getCalendarDates = () => {
    if (calendarView === 'month') {
      return getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    } else {
      return getWeekDates(currentDate);
    }
  };

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Team Attendance Lite</h1>
              <span className="ml-2 text-sm text-gray-500">(데모 모드)</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm text-gray-700">{user.name}</span>
                <span className="text-xs text-gray-500">({user.role === 'manager' ? '관리자' : '직원'})</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 캘린더 뷰 토글 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button
              variant={calendarView === 'month' ? 'default' : 'outline'}
              onClick={() => setCalendarView('month')}
            >
              월간 보기
            </Button>
            <Button
              variant={calendarView === 'week' ? 'default' : 'outline'}
              onClick={() => setCalendarView('week')}
            >
              주간 보기
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                const newDate = new Date(currentDate);
                if (calendarView === 'month') {
                  newDate.setMonth(newDate.getMonth() - 1);
                } else {
                  newDate.setDate(newDate.getDate() - 7);
                }
                setCurrentDate(newDate);
              }}
            >
              이전
            </Button>
            
            <span className="text-lg font-medium">
              {calendarView === 'month' 
                ? `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`
                : `${formatDate(currentDate)}`
              }
            </span>
            
            <Button
              variant="outline"
              onClick={() => {
                const newDate = new Date(currentDate);
                if (calendarView === 'month') {
                  newDate.setMonth(newDate.getMonth() + 1);
                } else {
                  newDate.setDate(newDate.getDate() + 7);
                }
                setCurrentDate(newDate);
              }}
            >
              다음
            </Button>
          </div>
        </div>

        {/* 캘린더 */}
        <div className="bg-white rounded-lg shadow p-6">
          {calendarView === 'month' ? (
            <div className="grid grid-cols-7 gap-1">
              {/* 요일 헤더 */}
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* 날짜 셀 */}
              {getCalendarDates().map((date, index) => {
                const events = getEventsForDate(date);
                const isCurrentMonthDate = isCurrentMonth(date);
                
                return (
                  <div
                    key={index}
                    className={`p-2 min-h-[80px] border border-gray-200 ${
                      isToday(date) ? 'bg-blue-50 border-blue-300' : ''
                    } ${
                      !isCurrentMonthDate ? 'bg-gray-50 text-gray-400' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {date.getDate()}
                    </div>
                    
                    {/* 이벤트 표시 */}
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded mb-1 ${
                          event.type === 'leave' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {event.userName} {event.leaveType === 'half_morning' ? '오전반차' : 
                                        event.leaveType === 'half_afternoon' ? '오후반차' : 
                                        event.leaveType === 'sick' ? '병가' : '휴가'}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* 요일 헤더 */}
              {getWeekDates(currentDate).map((date) => (
                <div key={date.toISOString()} className="p-2 text-center">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
                  </div>
                  <div className="text-lg font-bold">
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 선택된 날짜 상세 정보 */}
        {selectedDate && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {formatDate(selectedDate)} 상세
              </h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(undefined)}>
                닫기
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">이 날의 휴가 신청</h4>
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map((event) => (
                      <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{event.userName}</span>
                          <span className="text-sm text-gray-500">
                            {event.leaveType === 'annual' ? '연차' :
                             event.leaveType === 'half_morning' ? '오전 반차' :
                             event.leaveType === 'half_afternoon' ? '오후 반차' :
                             event.leaveType === 'sick' ? '병가' : '기타'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">휴가 신청이 없습니다.</p>
                )}
              </div>
              
              {user.role === 'employee' && (
                <div>
                  <Button className="w-full">
                    이 날 휴가 신청하기
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 관리자 대시보드 */}
        {user.role === 'manager' && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">승인 대기 건</h3>
            {mockLeaveRequests.length > 0 ? (
              <div className="space-y-3">
                {mockLeaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{request.userName}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">{request.reason}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        승인
                      </Button>
                      <Button variant="destructive" size="sm">
                        반려
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">승인 대기 건이 없습니다.</p>
            )}
          </div>
        )}

        {/* 데모 모드 안내 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">데모 모드</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>현재 Firebase 연동 없이 더미 데이터로 작동 중입니다. 실제 사용을 위해서는 Firebase 설정이 필요합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 