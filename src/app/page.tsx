'use client';

import { useState, useEffect } from 'react';
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
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Firebase에서 스케줄 데이터 가져오기
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/schedules');
        if (!res.ok) throw new Error('Failed to fetch schedules');
        const data = await res.json();
        
        if (data.items && data.items.length > 0) {
          setSchedules(data.items);
        } else {
          // 스케줄이 없으면 샘플 데이터 생성
          await createSampleSchedules();
        }
      } catch (error) {
        console.error('Failed to load schedules:', error);
        // 에러 시에도 샘플 데이터 생성
        await createSampleSchedules();
      } finally {
        setLoadingSchedules(false);
      }
    };

    const createSampleSchedules = async () => {
      const sampleSchedules = [
        {
          scheduleId: 'sc_sample_001',
          partnerId: 'p_001',
          userId: 'u_001',
          title: '팀 미팅',
          description: '주간 팀 미팅',
          startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 내일
          endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 내일 + 1시간
          type: 'MEETING'
        },
        {
          scheduleId: 'sc_sample_002',
          partnerId: 'p_001',
          userId: 'u_001',
          title: '프로젝트 리뷰',
          description: '프로젝트 진행 상황 리뷰',
          startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 모레
          endDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 모레 + 2시간
          type: 'PROJECT'
        }
      ];

      try {
        for (const schedule of sampleSchedules) {
          await fetch('/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(schedule)
          });
        }
        
        // 생성 후 다시 조회
        const res = await fetch('/api/schedules');
        if (res.ok) {
          const data = await res.json();
          setSchedules(data.items || []);
        }
      } catch (error) {
        console.error('Failed to create sample schedules:', error);
      }
    };

    if (user) {
      fetchSchedules();
    }
  }, [user]);

  // Firebase에서 이벤트와 휴가 신청 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 이벤트 데이터 가져오기 (leaves API 사용)
        const leavesRes = await fetch('/api/leaves');
        if (leavesRes.ok) {
          const leavesData = await leavesRes.json();
          const eventsData = leavesData.items?.map((leave: any) => ({
            id: leave.id,
            type: 'leave',
            date: new Date(leave.startDate),
            userId: leave.userId,
            userName: leave.userId, // 실제로는 사용자 이름을 가져와야 함
            leaveType: leave.leaveType,
            isHalfDay: leave.leaveType.includes('HALF'),
          })) || [];
          setEvents(eventsData);
        }

        // 휴가 신청 데이터 가져오기
        const requestsRes = await fetch('/api/leaves?status=PENDING');
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          const requests = requestsData.items?.map((leave: any) => ({
            id: leave.id,
            userId: leave.userId,
            userName: leave.userId, // 실제로는 사용자 이름을 가져와야 함
            type: leave.leaveType,
            startDate: new Date(leave.startDate),
            endDate: new Date(leave.endDate),
            reason: leave.reason,
            status: leave.status,
            createdAt: new Date(leave.appliedAt),
            updatedAt: new Date(leave.appliedAt),
          })) || [];
          setLeaveRequests(requests);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);


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
    // Firebase 스케줄 데이터를 캘린더 이벤트로 변환
    const scheduleEvents = schedules.map(schedule => {
      const startDate = new Date(schedule.startDateTime.seconds * 1000);
      return {
        id: schedule.id,
        type: 'schedule',
        date: startDate,
        userId: schedule.userId,
        userName: schedule.title,
        leaveType: schedule.type,
        isHalfDay: false,
        description: schedule.description
      };
    });

    // Firebase 이벤트와 스케줄 합치기
    const allEvents = [...events, ...scheduleEvents];
    
    return allEvents.filter(event => 
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
          {loadingSchedules ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">스케줄 로딩 중...</span>
            </div>
          ) : calendarView === 'month' ? (
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
                            : event.type === 'schedule'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {event.type === 'schedule' ? (
                          <div>
                            <div className="font-medium">{event.userName}</div>
                            <div className="text-xs opacity-75">{event.leaveType}</div>
                          </div>
                        ) : (
                          <div>
                            {event.userName} {event.leaveType === 'half_morning' ? '오전반차' : 
                                            event.leaveType === 'half_afternoon' ? '오후반차' : 
                                            event.leaveType === 'sick' ? '병가' : '휴가'}
                          </div>
                        )}
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
                <h4 className="font-medium text-gray-700 mb-2">이 날의 일정</h4>
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map((event) => (
                      <div key={event.id} className={`p-3 rounded-lg ${
                        event.type === 'schedule' ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{event.userName}</span>
                            {'description' in event && event.description && (
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            )}
                          </div>
                          <span className={`text-sm px-2 py-1 rounded ${
                            event.type === 'schedule' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'text-gray-500'
                          }`}>
                            {event.type === 'schedule' ? event.leaveType :
                             event.leaveType === 'annual' ? '연차' :
                             event.leaveType === 'half_morning' ? '오전 반차' :
                             event.leaveType === 'half_afternoon' ? '오후 반차' :
                             event.leaveType === 'sick' ? '병가' : '기타'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">일정이 없습니다.</p>
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
            {leaveRequests.length > 0 ? (
              <div className="space-y-3">
                {leaveRequests.map((request) => (
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