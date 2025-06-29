"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해 주세요.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        image_url: imageUrl || null,
      },
    ]);
    setLoading(false);
    if (error) {
      setError("게시글 등록 중 오류가 발생했습니다.");
    } else {
      setSuccess("게시글이 등록되었습니다!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <main style={{ maxWidth: 500, margin: "0 auto", padding: 32, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #0001", marginTop: 48 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>뉴스 작성</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc", minHeight: 120 }}
            placeholder="내용을 입력하세요"
            required
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>이미지 URL (선택)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            placeholder="이미지 URL을 입력하세요"
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: "green", marginBottom: 12 }}>{success}</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, borderRadius: 8, background: "#4b6cb7", color: "#fff", fontWeight: 700, fontSize: 18, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </form>
    </main>
  );
} 