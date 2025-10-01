import { useState } from "react";
import { useRouter } from "next/router";
import { Upload as UploadIcon, User, Phone } from "lucide-react";

export default function Upload() {
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [status, setStatus] = useState("");
const router = useRouter();

function sanitizePhone(p) {
return (p || "").replace(/\D/g, "");
}

async function onSubmit(e) {
e.preventDefault();

if (!name.trim() || !phone.trim()) {  
  setStatus("⚠️ Veuillez remplir votre nom et votre numéro de téléphone.");  
  return;  
}  

setStatus("⏳ Uploading...");  

try {  
  const finalName = name.trim().endsWith("(RXP)")  
    ? name.trim()  
    : name.trim() + " (RXP)";  

  const res = await fetch("/api/upload", {  
    method: "POST",  
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify({  
      name: finalName,  
      phone: sanitizePhone(phone),  
    }),  
  });  

  const json = await res.json();  

  if (!res.ok) {  
    setStatus(json?.error || "❌ Upload failed");  
  } else if (json.exists) {  
    setStatus("⚠️ Contact already exists.");  
  } else {  
    setStatus("✅ Votre numéro a été enregistré avec succès. Nous vous invitons à rejoindre notre communauté et à rester connecté pour toutes nos actualités et offres");  
    // Redirection safely in browser  
    setTimeout(() => {  
      window.location.href = "https://chat.whatsapp.com/PUT_REAL_GROUP_LINK_HERE";  
    }, 2000);  
  }  
} catch (err) {  
  console.error(err);  
  setStatus("❌ Upload failed.");  
}

}

return (
<div className="max-w-lg mx-auto px-4 py-10 text-center animate-fade-in">
<h2 className="text-3xl font-bold text-neon-green drop-shadow-glow">
Upload Contact
</h2>
<p className="text-sm text-neon-green/80 mt-2 tracking-wide">
 Ajoutez vos coordonnées pour rejoindre la communauté Ralph Xpert.
</p>

<form  
    onSubmit={onSubmit}  
    className="mt-8 grid gap-6 bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-neon-green/50 shadow-glow"  
  >  
    <label className="grid gap-2">  
      <span className="flex items-center gap-2 text-neon-green text-sm">  
        <User size={16} /> Full Name  
      </span>  
      <input  
        value={name}  
        onChange={(e) => setName(e.target.value)}  
        placeholder="Enter full name..."  
        className="px-4 py-3 rounded-xl bg-black/70 border border-neon-green/40 text-neon-green placeholder-neon-green/40 outline-none focus:ring-2 focus:ring-neon-green transition-all duration-300"  
      />  
    </label>  

    <label className="grid gap-2">  
      <span className="flex items-center gap-2 text-neon-green text-sm">  
        <Phone size={16} /> Phone Number  
      </span>  
      <input  
        value={phone}  
        onChange={(e) => setPhone(e.target.value)}  
        placeholder="e.g. +509..."  
        className="px-4 py-3 rounded-xl bg-black/70 border border-neon-green/40 text-neon-green placeholder-neon-green/40 outline-none focus:ring-2 focus:ring-neon-green transition-all duration-300"  
      />  
    </label>  

    <div className="flex items-center justify-center">  
      <button  
        type="submit"  
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-black bg-neon-green hover:scale-105 hover:shadow-glow transition-all duration-300"  
      >  
        <UploadIcon size={18} /> Upload  
      </button>  
    </div>  
  </form>  

  {status && (  
    <div className="mt-6 text-neon-green animate-pulse">{status}</div>  
  )}  
</div>

);
}

      
