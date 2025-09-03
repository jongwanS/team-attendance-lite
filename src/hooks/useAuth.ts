import { useState, useEffect } from 'react';
// Firebase 인증 - 현재 사용하지 않음
// import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
// import { auth } from '@/lib/firebase';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase 인증 대신 더미 사용자로 설정
    setTimeout(() => {
      const dummyUser: User = {
        id: 'dummy-user-1',
        email: 'user@example.com',
        name: '김철수',
        avatar: undefined,
        role: 'employee', // 또는 'manager'로 변경하여 테스트 가능
        teamId: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(dummyUser);
      setLoading(false);
    }, 1000);
  }, []);

  const signInWithGoogle = async () => {
    // 더미 로그인 - 실제로는 아무것도 하지 않음
    console.log('더미 Google 로그인');
  };

  const logout = async () => {
    // 더미 로그아웃
    setUser(null);
  };

  return {
    user,
    loading,
    signInWithGoogle,
    logout,
  };
} 