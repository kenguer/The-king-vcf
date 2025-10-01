
import { useEffect, useState } from "react";
import {
Shield,
Trash2,
Download,
FileText,
LogOut,
MessageCircle,
X,
} from "lucide-react";

export default function Admin() {
const [authed, setAuthed] = useState(false);
const [contacts, setContacts] = useState([]);
const [messages, setMessages] = useState([]);
const [showMessages, setShowMessages] = useState(false);
const [user, setUser] = useState("");
const [pass, setPass] = useState("");
const [loading, setLoading] = useState(false);

async function checkAuth() {
try {
const res = await fetch("/api/admin/check");
const ok = res.ok;
setAuthed(ok);
return ok;
} catch (err) {
console.error("checkAuth error:", err);
setAuthed(false);
return false;
}
}

useEffect(() => {
(async () => {
const ok = await checkAuth();
if (ok) {
await loadContacts();
await loadMessages();
}
})();
}, []);

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
alert(j?.error || "Login failed");
}
} catch (err) {
setLoading(false);
console.error("login error:", err);
alert("Login failed (network)");
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
console.log("GET /api/contacts", res.status, j);

if (!res.ok) {
console.error("Failed to fetch contacts", j);
setContacts([]);
return;
}

const maybeArray =
j?.ralph_xpert ?? j?.contacts ?? j?.data ?? j ?? null;

const finalArray = Array.isArray(maybeArray)
? maybeArray
: Array.isArray(maybeArray?.data)
? maybeArray.data
: [];

setContacts(finalArray);
} catch (err) {
console.error("loadContacts error:", err);
setContacts([]);
}

}

async function loadMessages() {
try {
const res = await fetch("/api/messages");
const j = await res.json().catch(() => null);
if (!res.ok) {
console.error("Failed to fetch messages", j);
setMessages([]);
return;
}
setMessages(j?.messages ?? []);
} catch (err) {
console.error("loadMessages error:", err);
setMessages([]);
}
}

async function markMessagesRead() {
try {
await fetch("/api/messages/read", { method: "POST" });
setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
} catch (err) {
console.error("markMessagesRead error:", err);
}
}

async function deleteOne(id) {
if (!confirm("Delete contact?")) return;
const res = await fetch("/api/delete", {
method: "POST",
headers: { "content-type": "application/json" },
body: JSON.stringify({ id }),
});
if (res.ok) loadContacts();
else alert("Failed");
}

async function deleteAll() {
if (!confirm("Delete ALL contacts?")) return;
const res = await fetch("/api/deleteAll", { method: "POST" });
if (res.ok) loadContacts();
else alert("Failed");
}

function downloadVCF() {
window.location.href = "/api/export-vcf";
}
function downloadPDF() {
window.location.href = "/api/export-pdf";
}

const unreadCount = messages.filter((m) => !m.read).length;

if (!authed) {
return (

<div className="max-w-sm mx-auto px-4 py-8">    
<h2 className="text-2xl font-bold inline-flex items-center gap-2">    
<Shield size={18} /> Admin Login    
</h2>    
<form onSubmit={login} className="mt-4 grid gap-3">    
<input    
placeholder="username"    
value={user}    
onChange={(e) => setUser(e.target.value)}    
className="px-4 py-3 rounded-xl bg-bgsoft border border-white/10"    
/>    
<input    
placeholder="password"    
type="password"    
value={pass}    
onChange={(e) => setPass(e.target.value)}    
className="px-4 py-3 rounded-xl bg-bgsoft border border-white/10"    
/>    
<button type="submit" className="btn-primary px-4 py-2 rounded-2xl">    
{loading ? "..." : "Login"}    
</button>    
</form>    
</div>    
);    
}  return (  <div className="max-w-6xl mx-auto px-4 py-8">    
<div className="flex items-center justify-between">    
<h2 className="text-2xl font-bold inline-flex items-center gap-2">    
<Shield size={18} /> Admin Dashboard    
</h2>    
<div className="flex items-center gap-2">    
<button      
onClick={downloadVCF}      
className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10"      
>    
<Download size={16} /> Download VCF    
</button>    
<button      
onClick={downloadPDF}      
className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10"      
>    
<FileText size={16} /> Download PDF    
</button>    
<button      
onClick={deleteAll}      
className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10"      
>    
<Trash2 size={16} /> Delete All    
</button>    
<button      
onClick={logout}      
className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10"      
>    
<LogOut size={16} /> Logout    
</button>    
</div>    
</div>  {/* Contacts table */}    <div className="mt-6 card rounded-2xl overflow-hidden">      
    <table className="w-full text-sm">      
      <thead className="text-left text-gray-300/80">      
        <tr>      
          <th className="px-4 py-2">#</th>      
          <th className="px-4 py-2">Name</th>      
          <th className="px-4 py-2">Phone</th>      
          <th className="px-4 py-2">Created</th>      
          <th className="px-4 py-2">Action</th>      
        </tr>      
      </thead>      
      <tbody>      
        {contacts.map((c, i) => (      
          <tr key={c.id ?? i} className="odd:bg-white/[0.02]">      
            <td className="px-4 py-2">{i + 1}</td>      
            <td className="px-4 py-2">{c.name}</td>      
            <td className="px-4 py-2">{c.phone}</td>      
            <td className="px-4 py-2">      
              {c.created_at      
                ? new Date(c.created_at).toLocaleString()      
                : "-"}      
            </td>      
            <td className="px-4 py-2">      
              <button      
                onClick={() => deleteOne(c.id)}      
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10"      
              >      
                <Trash2 size={14} /> Delete      
              </button>      
            </td>      
          </tr>      
        ))}      
        {contacts.length === 0 && (      
          <tr>      
            <td      
              colSpan={5}      
              className="px-4 py-8 text-center text-gray-400"      
            >      
              No contacts yet.      
            </td>      
          </tr>      
        )}      
      </tbody>      
    </table>      
  </div>    {/* Floating Messages Button */}    <div className="fixed bottom-6 right-6">      
    <button      
      onClick={() => {      
        setShowMessages(!showMessages);      
        if (!showMessages) markMessagesRead();      
      }}      
      className="relative bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"      
    >      
      <MessageCircle size={24} />      
      {unreadCount > 0 && (      
        <span className="absolute -top-1 -right-1 bg-red-600 text-xs font-bold px-2 py-0.5 rounded-full">      
          {unreadCount}      
        </span>      
      )}      
    </button>      
  </div>    {/* Popup for messages */}  
{showMessages && (  
<div className="fixed bottom-20 right-6 w-96 max-h-[70vh] bg-bgsoft border border-white/10 rounded-2xl shadow-lg overflow-y-auto">  
<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">  
<h3 className="font-bold">Messages</h3>  
<button onClick={() => setShowMessages(false)}>  
<X size={18} />  
</button>  
</div>  
<div>  
{messages.length === 0 ? (  
<p className="p-4 text-gray-400 text-sm">No messages yet.</p>  
) : (  
messages.map((m, i) => (  
<div key={m.id ?? i} className="p-4 border-b border-white/5">  
<p className="font-semibold">  
{m.name} ({m.email})  
</p>  
<p className="text-sm text-gray-400">{m.phone}</p>  
<p className="text-sm text-gray-300 mt-2">{m.topic}</p>  
<p className="mt-2">{m.message}</p>  
<p className="text-xs text-gray-500 mt-1">  
{m.created_at  
? new Date(m.created_at).toLocaleString()  
: "-"}  
</p>  
</div>  
))  
)}  
</div>  
</div>  
)}  </div>  );  
}  



  
