"use client";
import React, { useState } from "react";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"; // 실제 엔드포인트로 교체 필요
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || ""; // 환경변수에서 키를 불러옴

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat", // 실제 모델명으로 교체 필요
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const aiMessage = data.choices?.[0]?.message?.content || "답변을 가져오지 못했습니다.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiMessage }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "에러가 발생했습니다." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>AI 챗봇 (Deepseek)</h2>
      <div style={{ minHeight: 200, marginBottom: 16 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "8px 0" }}>
            <b>{msg.role === "user" ? "나" : "AI"}:</b> {msg.content}
          </div>
        ))}
        {loading && <div>AI가 답변 중입니다...</div>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{ flex: 1, padding: 8 }}
          placeholder="메시지를 입력하세요"
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          전송
        </button>
      </div>
    </div>
  );
} 