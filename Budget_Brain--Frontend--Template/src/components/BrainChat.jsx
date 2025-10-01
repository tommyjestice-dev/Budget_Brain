import React, { useEffect, useRef, useState } from "react";

export default function BrainChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const containerRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
  
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ block: "end" });
      
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  const send = async () => {
    const text = message.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setMessage("");
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/brainchat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        throw new Error(`Non-JSON (${res.status}): ${raw.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(data?.meta?.error || data?.error || `HTTP ${res.status}`);
      }

      const botText = data?.reply || "(No reply)";
      setMessages([...next, { role: "bot", text: botText }]);
    } catch (e) {
      console.error(e);
      setErr(e?.message || "Could not reach server.");
      
      setMessages(prev => [...prev, { role: "bot", text: "(Temporary issue — please try again.)" }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  };

  const onKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-3">Brain Chat</h2>


      <div
        ref={containerRef}
        className="h-80 overflow-y-auto rounded border border-white/10 p-2 space-y-2 bg-black/30"
      >
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={[
                "inline-block px-3 py-2 rounded-lg max-w-[80%] break-words",
                m.role === "user" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-100",
              ].join(" ")}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">Thinking…</div>}
        <div ref={endRef} />
      </div>

      {err && <p className="text-red-400 mt-2 text-sm">{err}</p>}

      <form onSubmit={onSubmit} className="mt-3 space-y-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder='Ask anything about your budget…'
          disabled={loading}
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded shadow disabled:bg-gray-500"
          >
            {loading ? "Sending…" : "Ask Gemini"}
          </button>
          <span className="text-xs text-white/60">
            Press <kbd className="px-1 py-0.5 rounded bg-white/10">Enter/Return</kbd> to send,{" "}
            <kbd className="px-1 py-0.5 rounded bg-white/10">Shift</kbd>+<kbd className="px-1 py-0.5 rounded bg-white/10">Enter/Return</kbd> for newline
          </span>
        </div>
      </form>
    </div>
  );
}
