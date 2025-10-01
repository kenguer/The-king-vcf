import { useState, useEffect } from "react";
import { supabaseAdmin } from "../../../lib/supabaseServer";


export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false }); // ✅ latest first
    if (!error) setMessages(data);
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (password === process.env.ADMIN_PASS) {
      setUnlocked(true);
      loadMessages();
    } else {
      alert("Wrong password!");
    }
  }

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto p-8">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">📩 Submitted Messages</h1>
      {messages.length === 0 && (
        <p className="text-gray-500">No messages yet.</p>
      )}
      <ul className="space-y-4">
        {messages.map((msg) => (
          <li key={msg.id} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{msg.full_name}</span>
              <span className="text-xs text-gray-400">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{msg.email} • {msg.phone}</p>
            <p className="mt-2 font-semibold">{msg.subject}</p>
            <p className="mt-1">{msg.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
              }

            
