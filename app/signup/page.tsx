"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 회원가입
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
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
            회원가입
          </h1>
          <p style={{ 
            color: '#666', 
            marginTop: 8,
            fontSize: 16
          }}>
            뉴스 편향도 분석 플랫폼에 가입하세요
          </p>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSignup} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginBottom: 8,
              color: '#222b45',
              fontSize: 14
            }}>
              사용자명
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
              placeholder="사용자명을 입력하세요"
              onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#4b6cb7'}
              onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e1e5e9'}
            />
          </div>

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
              onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#4b6cb7'}
              onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e1e5e9'}
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
              placeholder="비밀번호를 입력하세요 (최소 6자)"
              onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#4b6cb7'}
              onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e1e5e9'}
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

          {success && (
            <div style={{ 
              color: '#27ae60', 
              marginBottom: 16,
              padding: '12px',
              background: '#f0f9f4',
              borderRadius: 8,
              fontSize: 14,
              textAlign: 'center'
            }}>
              {success}
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
            onMouseEnter={(e) => !loading && ((e.target as HTMLButtonElement).style.background = '#3a5a9a')}
            onMouseLeave={(e) => !loading && ((e.target as HTMLButtonElement).style.background = '#4b6cb7')}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        {/* 로그인 링크 */}
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
            이미 계정이 있으신가요?{' '}
            <Link href="/login" style={{
              color: '#4b6cb7',
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              로그인
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