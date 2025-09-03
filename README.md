# Team Attendance Lite

사내 소규모 팀을 위한 근태 관리 웹 앱입니다.

## 주요 기능

- **근무 캘린더**: 월간/주간 뷰로 팀 일정을 한눈에 확인
- **휴가 신청**: 연차, 반차, 병가 등 휴가 신청 및 관리
- **관리자 승인**: 휴가 신청 승인/반려 처리
- **실시간 동기화**: Firebase를 통한 실시간 데이터 동기화

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Firebase (Auth, Firestore)
- **State Management**: React Query (TanStack)
- **Form Handling**: React Hook Form + Zod

## 시작하기

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 메인 페이지
│   └── globals.css     # 전역 스타일
├── components/          # UI 컴포넌트
│   └── ui/             # 기본 UI 컴포넌트
├── hooks/               # 커스텀 훅
├── lib/                 # 유틸리티 및 설정
├── types/               # TypeScript 타입 정의
└── utils/               # 헬퍼 함수
```

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 프로젝트를 연결
2. 환경 변수 설정
3. 자동 배포 설정

### Firebase 설정

1. Firebase 프로젝트 생성
2. Authentication 활성화 (Google 로그인)
3. Firestore 데이터베이스 생성
4. 보안 규칙 설정

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 