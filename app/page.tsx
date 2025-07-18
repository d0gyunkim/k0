'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from './supabaseClient';

// 임시 뉴스 데이터 (실제로는 사용되지 않음)
const newsList = [
  { id: 1, title: '첫 번째 뉴스', summary: '이것은 첫 번째 뉴스의 요약입니다.' },
  { id: 2, title: '두 번째 뉴스', summary: '이것은 두 번째 뉴스의 요약입니다.' },
  { id: 3, title: '세 번째 뉴스', summary: '이것은 세 번째 뉴스의 요약입니다.' },
];

/**
 * 메인 홈페이지 컴포넌트
 * 뉴스 목록을 표시하고 카테고리별 필터링 기능 제공
 */
export default function HomePage() {
  // 뉴스 데이터 및 UI 상태 관리
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');

  // 뉴스 카테고리 정의
  const categories = [
    { key: 'all', label: '오늘의 이슈' },
    { key: 'politics', label: '정치' },
    { key: 'international', label: '국제' },
    { key: 'sports', label: '스포츠' },
    { key: 'economy', label: '경제' },
    { key: 'science', label: '과학' },
    { key: 'social', label: '사회' },
    { key: 'culture', label: '문화' },
  ];

  // 사용자 정보 가져오기
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        if (data && data.username) setUsername(data.username);
      } else {
        setUsername('');
      }
    };
    getUser();
  }, []);

  // 로그아웃 함수
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUsername('');
  };

  // 컴포넌트 마운트 시 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      // Supabase에서 뉴스 포스트 데이터 가져오기
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, image_url, created_at, category, news_sources, right_content, left_content, mid_content, right_news_sources, left_news_sources, mid_news_sources')
        .order('created_at', { ascending: false });
      
      if (error) {
        setError('뉴스를 불러오는 중 오류가 발생했습니다.');
        setPosts([]);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // 카테고리별로 필터링된 포스트 생성
  let filteredPosts = [];
  if (selectedCategory === 'all') {
    // '오늘의 이슈' 선택 시: 각 카테고리별로 기사수가 많은 top 2개씩만 추출
    const postsByCategory = {};
    posts.forEach(post => {
      if (!post.category) return;
      if (!postsByCategory[post.category]) postsByCategory[post.category] = [];
      postsByCategory[post.category].push(post);
    });
    
    // 각 카테고리별로 뉴스 소스 수 기준으로 정렬하여 상위 2개씩 선택
    filteredPosts = (Object.values(postsByCategory) as any[])
      .flatMap((arr: any[]) => arr
        .sort((a, b) => (b.news_sources ?? 0) - (a.news_sources ?? 0))
        .slice(0, 2)
      )
      .filter(Boolean); // undefined/null 제거
    
    // 중복 id 제거 (같은 뉴스가 여러 카테고리에 있을 수 있음)
    const seen = new Set();
    filteredPosts = filteredPosts.filter(post => {
      if (!post || seen.has(post.id)) return false;
      seen.add(post.id);
      return true;
    });
  } else {
    // 특정 카테고리 선택 시: 해당 카테고리의 모든 뉴스 표시
    filteredPosts = posts.filter(post => post.category === selectedCategory);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafcff' }}>
      {/* 메인 네비게이션 바 */}
      <nav style={{ width: '100%', background: '#fff', color: '#222b45', padding: '16px 0 8px 0', display: 'flex', flexDirection: 'row', alignItems: 'center', boxShadow: '0 2px 8px #0001', position: 'fixed', top: 0, left: 0, zIndex: 101, minHeight: 72 }}>
        {/* 로고 이미지 */}
        <img src="/KakaoTalk_Photo_2025-06-27-18-43-30.png" alt="logo" style={{ height: 72, marginLeft: 32, marginRight: 24, borderRadius: '50%', background: '#fff' }} />
        
        {/* 네비게이션 링크들 */}
        <Link href="/" style={{ color: '#222b45', textDecoration: 'none', marginRight: 24, fontSize: 18, fontWeight: 500, textAlign: 'center', padding: '10px 0', borderRadius: 8, transition: 'background 0.2s', display: 'block' }}>Home</Link>
        <Link href="/" style={{ color: '#222b45', textDecoration: 'none', marginRight: 24, fontSize: 18, fontWeight: 500, textAlign: 'center', padding: '10px 0', borderRadius: 8, transition: 'background 0.2s', display: 'block' }}>News</Link>
        {/* 로그인/로그아웃 버튼 영역 */}
        <div style={{ marginLeft: 'auto', marginRight: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span style={{ fontWeight: 700, color: '#4b6cb7', fontSize: 16 }}>{username || '사용자'}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.target as HTMLButtonElement).style.background = '#c0392b'}
                onMouseLeave={e => (e.target as HTMLButtonElement).style.background = '#e74c3c'}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" style={{ color: '#4b6cb7', fontWeight: 700, fontSize: 16, textDecoration: 'none', padding: '8px 16px', borderRadius: 8, border: '1.5px solid #4b6cb7', background: '#fff', transition: 'background 0.2s' }}>
              로그인
            </Link>
          )}
        </div>
      </nav>
      
      {/* 메인 콘텐츠 영역 */}
      <main style={{ flex: 1, maxWidth: 800, margin: '0 auto', padding: 48, marginTop: 120, background: '#fafcff' }}>
        {/* 페이지 제목 */}
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, color: '#222b45' }}>최신 뉴스</h1>
        
        {/* 카테고리 선택 탭 */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                padding: '8px 24px',
                borderRadius: 20,
                border: 'none',
                background: selectedCategory === cat.key ? '#4b6cb7' : '#e3e7ef',
                color: selectedCategory === cat.key ? '#fff' : '#222b45',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: selectedCategory === cat.key ? '0 2px 8px #4b6cb733' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        {/* 뉴스 목록 렌더링 */}
        {loading ? (
          // 로딩 상태 표시
          <div style={{ textAlign: 'center', color: '#888', fontSize: 20 }}>뉴스를 불러오는 중...</div>
        ) : error ? (
          // 에러 상태 표시
          <div style={{ textAlign: 'center', color: 'red', fontSize: 20 }}>{error}</div>
        ) : (
          // 뉴스 목록 표시
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredPosts.length === 0 ? (
              // 뉴스가 없을 때 메시지
              <li style={{ textAlign: 'center', color: '#888', fontSize: 20 }}>등록된 뉴스가 없습니다.</li>
            ) : (
              // 뉴스 카드들 렌더링
              filteredPosts.map((post) => {
                // 편향도 계산: 진보/중도/보수 뉴스 소스 비율 계산
                const left = Number(post.left_news_sources) || 0;    // 진보 뉴스 소스 수
                const mid = Number(post.mid_news_sources) || 0;      // 중도 뉴스 소스 수
                const right = Number(post.right_news_sources) || 0;  // 보수 뉴스 소스 수
                const total = left + mid + right;
                
                // 각 편향도별 퍼센트 계산
                const leftPercent = total ? Math.round((left / total) * 100) : 0;
                const midPercent = total ? Math.round((mid / total) * 100) : 0;
                const rightPercent = total ? Math.round((right / total) * 100) : 0;
                
                return (
                  <li
                    key={post.id}
                    style={{
                      marginBottom: 40,
                      borderRadius: 18,
                      background: '#fff',
                      boxShadow: '0 4px 16px #0002',
                      padding: 0,
                      transition: 'box-shadow 0.2s',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 120,
                      maxWidth: 1000,
                    }}
                  >
                    {/* 뉴스 상세 페이지로 이동하는 링크 */}
                    <Link
                      href={`/news/${post.id}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {/* 뉴스 썸네일 이미지 */}
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          style={{
                            width: 140,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: '14px',
                            marginRight: 32,
                            background: '#eee',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      
                      {/* 뉴스 정보 영역 */}
                      <div style={{ flex: 1 }}>
                        {/* 뉴스 제목 */}
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#222b45', marginBottom: 18 }}>{post.title}</div>
                        
                        {/* 편향도 표시 바 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 20, fontWeight: 700 }}>
                          <span style={{ color: '#1976d2' }}>진보 {leftPercent}%</span>
                          <span style={{ color: '#888' }}>중도 {midPercent}%</span>
                          <span style={{ color: '#b71c1c' }}>보수 {rightPercent}%</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </main>
    </div>
  );
} 