import { useState } from "react";

export default function BrainChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function ask(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setErr("");
    setReply("");

    try {
      const res = await fetch("/api/brainchat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReply(data.reply || "(No reply)");
    } catch (e) {
      console.error(e);
      setErr("Could not reach Gemini. Check backend logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-4">Brain Chat</h2>

      <form onSubmit={ask} className="space-y-3">
        <textarea
          className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Ask anything about your budget (e.g., “Can I afford $500 for a chair this month?”)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded shadow"
        >
          {loading ? "Thinking…" : "Ask Gemini"}
        </button>
      </form>

      {err && <p className="text-red-400 mt-3 text-sm">{err}</p>}
      {reply && (
        <div className="mt-4 bg-gray-900 rounded p-3 border border-white/10 whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </div>
  );
}
