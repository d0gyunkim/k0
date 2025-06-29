"use client";

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      alert('회원가입 성공! 이메일을 확인해주세요.');
      router.push('/login');
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <h1>회원가입</h1>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">회원가입</button>
      </form>
      <div style={{ marginTop: 16 }}>
        이미 계정이 있으신가요? <a href="/login">로그인</a>
      </div>
    </main>
  );
} 