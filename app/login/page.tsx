'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Supabase 로그인 연동
    setError('');
    alert('로그인 기능은 추후 구현됩니다.');
  };

  return (
    <main style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <h1>로그인</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
        <button type="submit">로그인</button>
      </form>
      <div style={{ marginTop: 16 }}>
        계정이 없으신가요? <a href="/signup">회원가입</a>
      </div>
    </main>
  );
} 