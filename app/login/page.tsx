'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 이미 로그인된 사용자 확인
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/');
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // 로그인 성공 시 홈페이지로 이동
        router.push('/');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '48px',
        width: '100%',
        maxWidth: 400,
        textAlign: 'center'
      }}>
        {/* 로고 */}
        <div style={{ marginBottom: 32 }}>
          <img 
            src="/KakaoTalk_Photo_2025-06-27-18-43-30.png" 
            alt="logo" 
            style={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%',
              marginBottom: 16
            }} 
          />
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: '#222b45',
            margin: 0
          }}>
            로그인
          </h1>
          <p style={{ 
            color: '#666', 
            marginTop: 8,
            fontSize: 16
          }}>
            뉴스 편향도 분석 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: 8,
              color: '#222b45',
              fontSize: 14
            }}>
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                border: '2px solid #e1e5e9',
                fontSize: 16,
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="이메일을 입력하세요"
              onFocus={(e) => e.target.style.borderColor = '#4b6cb7'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: 8,
              color: '#222b45',
              fontSize: 14
            }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                border: '2px solid #e1e5e9',
                fontSize: 16,
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="비밀번호를 입력하세요"
              onFocus={(e) => e.target.style.borderColor = '#4b6cb7'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          {error && (
            <div style={{ 
              color: '#e74c3c', 
              marginBottom: 16,
              padding: '12px',
              background: '#fdf2f2',
              borderRadius: 8,
              fontSize: 14,
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 12,
              background: loading ? '#ccc' : '#4b6cb7',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              marginBottom: 24
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#3a5a9a')}
            onMouseLeave={(e) => !loading && (e.target.style.background = '#4b6cb7')}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div style={{ 
          textAlign: 'center',
          paddingTop: 24,
          borderTop: '1px solid #e1e5e9'
        }}>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: 14
          }}>
            계정이 없으신가요?{' '}
            <Link href="/signup" style={{
              color: '#4b6cb7',
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              회원가입
            </Link>
          </p>
        </div>

        {/* 홈으로 돌아가기 */}
        <div style={{ 
          textAlign: 'center',
          marginTop: 24
        }}>
          <Link href="/" style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: 14
          }}>
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 