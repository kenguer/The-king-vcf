import { useEffect, useState } from "react";
import {
  Shield,
  Trash2,
  Download,
  FileText,
  LogOut,
  MessageCircle,
  X,
  Edit2,
} from "lucide-react";

// Toast component
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neon-green/90 text-black px-4 py-2 rounded-xl shadow-lg animate-fade-in">
      {message}
    </div>
  );
}

// Modal edit contact
function EditModal({ contact, onClose, onSave }) {
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(contact?.phone || "");

  const save = () => {
    onSave({ ...contact, name, phone });
  };

  if (!contact) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black/90 p-6 rounded-2xl border border-neon-green max-w-md w-full">
        <h3 className="text-neon-green text-lg font-bold mb-4">Modifier Contact</h3>
        <input
          className="w-full mb-3 px-4 py-2 rounded-xl bg-black/70 border border-neon-green/40 text-neon-green outline-none focus:ring-2 focus:ring-neon-green"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
        />
        <input
          className="w-full mb-3 px-4 py-2 rounded-xl bg-black/70 border border-neon-green/40 text-neon-green outline-none focus:ring-2 focus:ring-neon-green"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-xl bg-neon-green hover:bg-neon-green/80 text-black transition-all"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [editingContact, setEditingContact] = useState(null);

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin/check");
      setAuthed(res.ok);
    } catch (err) {
      setAuthed(false);
    }
  }

  useEffect(() => {
    (async () => {
      await checkAuth();
      if (authed) {
        await loadContacts();
        await loadMessages();
      }
    })();
  }, [authed]);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      setLoading(false);
      if (res.ok) {
        setAuthed(true);
        await loadContacts();
        await loadMessages();
      } else {
        const j = await res.json().catch(() => ({}));
        setToast(j?.error || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      setToast("Login failed (network)");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setContacts([]);
    setMessages([]);
  }

  async function loadContacts() {
    try {
      const res = await fetch("/api/contacts");
      const j = await res.json().catch(() => null);
      const maybeArray =
        j?.ralph_xpert ?? j?.contacts ?? j?.data ?? j ?? null;
      const finalArray = Array.isArray(maybeArray)
        ? maybeArray
        : Array.isArray(maybeArray?.data)
        ? maybeArray.data
        : [];
      setContacts(finalArray);
    } catch (err) {
      setContacts([]);
    }
  }

  async function loadMessages() {
    try {
      const res = await fetch("/api/messages");
      const j = await res.json().catch(() => null);
      setMessages(j?.messages ?? []);
    } catch (err) {
      setMessages([]);
    }
  }

  async function markMessagesRead() {
    try {
      await fetch("/api/messages/read", { method: "POST" });
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    } catch {}
  }

  async function deleteOne(id) {
    if (!confirm("Delete contact?")) return;
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      loadContacts();
      setToast("Contact deleted ✅");
    } else setToast("Failed ❌");
  }

  async function deleteAll() {
    if (!confirm("Delete ALL contacts?")) return;
    const res = await fetch("/api/deleteAll", { method: "POST" });
    if (res.ok) {
      loadContacts();
      setToast("All contacts deleted ✅");
    } else setToast("Failed ❌");
  }

  function downloadVCF() {
    window.location.href = "/api/export-vcf";
    setToast("VCF export started ✅");
  }
  function downloadPDF() {
    window.location.href = "/api/export-pdf";
    setToast("PDF export started ✅");
  }

  async function saveEdit(contact) {
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (res.ok) {
        loadContacts();
        setToast("Contact updated ✅");
        setEditingContact(null);
      } else setToast("Failed ❌");
    } catch {
      setToast("Failed ❌");
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  if (!authed)
    return (
      <div className="max-w-sm mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold inline-flex items-center gap-2 text-neon-green">
          <Shield size={18} /> Admin Login
        </h2>
        <form onSubmit={login} className="mt-4 grid gap-3">
          <input
            placeholder="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="px-4 py-3 rounded-xl bg-bgsoft border border-white/10 focus:ring-2 focus:ring-neon-green outline-none"
          />
          <input
            placeholder="password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="px-4 py-3 rounded-xl bg-bgsoft border border-white/10 focus:ring-2 focus:ring-neon-green outline-none"
          />
          <button
            type="submit"
            className="btn-primary px-4 py-2 rounded-2xl bg-neon-green text-black hover:scale-105 transition-all duration-300"
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-neon-green">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold inline-flex items-center gap-2">
          <Shield size={18} /> Admin Dashboard
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadVCF}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neon-green hover:bg-neon-green/20 transition-all"
          >
            <Download size={16} /> Download VCF
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neon-green hover:bg-neon-green/20 transition-all"
          >
            <FileText size={16} /> Download PDF
          </button>
          <button
            onClick={deleteAll}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-500 hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={16} /> Delete All
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="mt-6 card rounded-2xl overflow-hidden shadow-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-300/80 bg-gray-900">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr
                key={c.id ?? i}
                className="odd:bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2">
                  {c.created_at ? new Date(c.created_at).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => setEditingContact(c)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button
                    onClick={() => deleteOne(c.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border
