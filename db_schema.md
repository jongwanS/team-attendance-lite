# DB 설계

## USER (사용자)
````json
users: {
  userId: "u_001",
  partnerId: "p_001",
  name: "김철수",
  email: "chulsoo@abc.com",
  phone: "010-1111-2222",
  role: "USER",   // ADMIN, MANAGER 가능
  hireDate: "2022-03-01",
  status: "ACTIVE", // ACTIVE, INACTIVE
  createdAt: "2025-09-18T07:10:00Z"
}
````

## PARTNERS (파트너)
````json
partners: {
  partnerId: "p_001",
  name: "ABC 협력사",
  contactPerson: "홍길동",
  phone: "010-1234-5678",
  email: "abc@partner.com",
  createdAt: "2025-09-18T07:00:00Z"
}
````

## ATTENDNACES (출퇴근 기록)
````json
attendance: {
  userId: "u_001",
  workDate: "2025-09-18",
  checkIn: "2025-09-18T09:10:00Z",
  checkOut: "2025-09-18T18:00:00Z",
  workHours: 8.5,
  status: "LATE",   // NORMAL, LATE, ABSENT, HALF_DAY, VACATION
  createdAt: "2025-09-18T18:05:00Z"
  remark: "주말출근/야근"
}
````

## leaves (휴가/반차)
````json
leaves: {
  leaveId: "lv_001",
  userId: "u_001",
  leaveType: "HALF_PM", // FULL, HALF_AM, HALF_PM, QUARTER
  reason: "병원 방문",
  startDate: "2025-09-19",
  endDate: "2025-09-19",
  status: "APPROVED", // PENDING, APPROVED, REJECTED
  appliedAt: "2025-09-15T09:00:00Z",
  approvedBy: "u_002"
}
````

## schedules (업무/프로젝트 일정)
````json
schedules: {
  scheduleId: "sc_001",
  partnerId: "p_001",
  userId: "u_001",
  title: "프로젝트 미팅",
  description: "신규 서비스 협의",
  startDateTime: "2025-09-20T10:00:00Z",
  endDateTime: "2025-09-20T11:00:00Z",
  type: "MEETING", // PROJECT, MEETING, SHIFT, OTHER
  createdAt: "2025-09-18T07:20:00Z"
}
````


--- 
# CURL 

#### USERS (사용자)
````shell
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"userId":"u_001","partnerId":"p_001","name":"김철수","email":"chulsoo@abc.com","phone":"010-1111-2222","role":"USER","hireDate":"2022-03-01","status":"ACTIVE"}'

# 조회 (전체)
curl http://localhost:3000/api/users

# 조회 (이름으로)
curl "http://localhost:3000/api/users?name=김철수"
````

#### PARTNERS (파트너)
````shell
# 생성
curl -X POST http://localhost:3000/api/partners \
  -H "Content-Type: application/json" \
  -d '{"partnerId":"p_001","name":"ABC 협력사","contactPerson":"홍길동","phone":"010-1234-5678","email":"abc@partner.com"}'

# 조회 (전체)
curl http://localhost:3000/api/partners

# 조회 (이름으로)
curl "http://localhost:3000/api/partners?name=ABC 협력사"
````

##### ATTENDANCE (출퇴근 기록)
````shell
# 생성
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{"userId":"u_001","workDate":"2025-09-18","checkIn":"2025-09-18T09:10:00Z","checkOut":"2025-09-18T18:00:00Z","workHours":8.5,"status":"LATE","remark":"주말출근/야근"}'

# 조회 (전체)
curl http://localhost:3000/api/attendance

# 조회 (사용자별)
curl "http://localhost:3000/api/attendance?userId=u_001"

# 조회 (날짜별)
curl "http://localhost:3000/api/attendance?workDate=2025-09-18"
````

#### LEAVES (휴가/반차)
````shell
# 생성
curl -X POST http://localhost:3000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{"leaveId":"lv_001","userId":"u_001","leaveType":"HALF_PM","reason":"병원 방문","startDate":"2025-09-19","endDate":"2025-09-19","status":"APPROVED","approvedBy":"u_002"}'

# 조회 (전체)
curl http://localhost:3000/api/leaves

# 조회 (사용자별)
curl "http://localhost:3000/api/leaves?userId=u_001"

# 조회 (상태별)
curl "http://localhost:3000/api/leaves?status=APPROVED"
````

#### schedules (업무/프로젝트 일정)
````shell
curl -X POST http://localhost:3000/api/schedules \
  -H "Content-Type: application/json" \
  -d '{"scheduleId":"sc_002","partnerId":"p_001","userId":"u_001","title":"프로젝트 미팅","description":"신규 서비스 협의","startDateTime":"2025-09-20T10:00:00Z","endDateTime":"2025-09-20T11:00:00Z","type":"MEETING"}'
  
# 전체 조회
curl http://localhost:3000/api/schedules

# 스케줄 ID로 조회
curl "http://localhost:3000/api/schedules?scheduleId=sc_002"

# 파트너별 조회
curl "http://localhost:3000/api/schedules?partnerId=p_001"

# 사용자별 조회
curl "http://localhost:3000/api/schedules?userId=u_001"

# 타입별 조회
curl "http://localhost:3000/api/schedules?type=MEETING"

# 날짜 범위 조회
curl "http://localhost:3000/api/schedules?startDate=2025-09-20&endDate=2025-09-21"
````