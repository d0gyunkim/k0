"use client";
import { supabase } from '../../supabaseClient';
import { notFound } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// =========================
// 뉴스 상세 페이지 (NewsDetailPage)
// - 특정 뉴스의 상세 정보, 이미지, 성향별 기사(진보/중도/보수) 등 표시
// - Supabase에서 데이터 fetch, 상태 관리, 렌더링
// =========================

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  // Next.js 동적 라우트에서 id 파라미터 추출
  const { id } = React.use(params);
  // id가 배열일 수도 있으므로 첫 번째 값만 사용
  const realId = Array.isArray(id) ? id[0] : id;

  // 뉴스 데이터 상태
  const [post, setPost] = React.useState<any>(null);
  // 로딩 상태
  const [loading, setLoading] = React.useState(true);

  // =========================
  // 데이터 패칭 (Supabase에서 뉴스 데이터 가져오기)
  // =========================
  React.useEffect(() => {
    const fetchPost = async () => {
      // posts 테이블에서 id로 단일 뉴스 데이터 조회
      const { data, error } = await supabase
        .from('posts')
        .select(`id, title, content, image_url, created_at, category, news_sources, right_content, left_content, mid_content`)
        .eq('id', Number(realId))
        .single();
      if (!data || error) {
        setPost(null); // 데이터 없거나 에러 시 null
      } else {
        setPost(data); // 정상 데이터 세팅
      }
      setLoading(false); // 로딩 종료
    };
    fetchPost();
  }, [realId]);

  // =========================
  // 로딩/404 처리
  // =========================
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 80 }}>뉴스를 불러오는 중...</div>;
  }
  if (!post) {
    notFound(); // 404 페이지로 이동
    return null;
  }

  // =========================
  // 렌더링 영역
  // =========================
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: 32,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 12px #0001',
        marginTop: 48,
        display: 'flex',
        gap: 40
      }}
    >
      {/* 왼쪽: 뉴스 본문 영역 */}
      <div style={{ flex: 2, minWidth: 0 }}>
        {/* 뉴스 제목 */}
        <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 18, color: '#1a1a1a', lineHeight: 1.2 }}>{post.title}</h1>
        {/* 날짜, 카테고리, 기사수 */}
        <div style={{ color: '#888', fontSize: 15, marginBottom: 18, display: 'flex', gap: 18, alignItems: 'center' }}>
          <span>{post.created_at ? new Date(post.created_at).toLocaleString('ko-KR') : '-'}</span>
          <span>카테고리: {post.category || '-'}</span>
          <span>전체 기사수: {post.news_sources ?? '-'}</span>
        </div>
        {/* 뉴스 대표 이미지 */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: 12, marginBottom: 32, background: '#eee' }}
          />
        )}
        {/* 뉴스 본문 내용 */}
        <div style={{ fontSize: 20, color: '#222', lineHeight: 1.7, marginBottom: 32 }}>{post.content}</div>
        {/* 성향별 기사 리스트 */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {/* 진보(좌) 기사 */}
          <div style={{ flex: 1, background: '#f7faf7', borderRadius: 10, padding: 18, minWidth: 0, boxShadow: '0 1px 4px #1976d211' }}>
            <div style={{ color: '#1976d2', fontWeight: 800, fontSize: 17, marginBottom: 12 }}>진보 기사</div>
            <div style={{ color: '#333', marginTop: 8 }}>{post.left_content || '등록된 기사가 없습니다.'}</div>
          </div>
          {/* 중도 기사 */}
          <div style={{ flex: 1, background: '#f7fafd', borderRadius: 10, padding: 18, minWidth: 0, boxShadow: '0 1px 4px #8882' }}>
            <div style={{ color: '#888', fontWeight: 800, fontSize: 17, marginBottom: 12 }}>중도 기사</div>
            <div style={{ color: '#333', marginTop: 8 }}>{post.mid_content || '등록된 기사가 없습니다.'}</div>
          </div>
          {/* 보수(우) 기사 */}
          <div style={{ flex: 1, background: '#fdf7f7', borderRadius: 10, padding: 18, minWidth: 0, boxShadow: '0 1px 4px #b71c1c11' }}>
            <div style={{ color: '#b71c1c', fontWeight: 800, fontSize: 17, marginBottom: 12 }}>보수 기사</div>
            <div style={{ color: '#333', marginTop: 8 }}>{post.right_content || '등록된 기사가 없습니다.'}</div>
          </div>
        </div>
      </div>
      {/* 오른쪽: (예시) id 정보만 표시 */}
      <div style={{ color: '#aaa', fontSize: 13 }}>
        <div>id: {post.id}</div>
      </div>
    </main>
  );
}
// =========================
// End of NewsDetailPage
// ========================= 