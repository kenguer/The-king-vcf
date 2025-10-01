"use client"

import { useState } from "react"
import { Mail, Phone, MessageCircle, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

const subjects = [
  { value: "support", label: "Support technique" },
  { value: "inscription", label: "Problème d'inscription" },
  { value: "partenariat", label: "Partenariat" },
  { value: "suggestion", label: "Suggestion d'amélioration" },
  { value: "autre", label: "Autre" },
]

const faqs = [
  {
    question: "📩 Quel est le délai de réponse ?",
    answer:
      "Nous répondons généralement sous 24h en jours ouvrés. Pour les urgences, contactez-nous directement par WhatsApp.",
  },
  {
    question: "💰 Les consultations sont-elles gratuites ?",
    answer: "Oui, toutes nos consultations initiales sont gratuites et sans engagement.",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", content: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nom || !formData.email || !formData.sujet || !formData.message) {
      setMessage({ type: "error", content: "Veuillez remplir tous les champs requis." })
      return
    }

    setIsSubmitting(true)
    try {
      // API call placeholder
      await new Promise((res) => setTimeout(res, 1000))
      setMessage({
        type: "success",
        content: "✅ Merci ! Votre message a été envoyé avec succès.",
      })
      setFormData({ nom: "", email: "", telephone: "", sujet: "", message: "" })
    } catch {
      setMessage({ type: "error", content: "Une erreur est survenue. Veuillez réessayer." })
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-[#2FD771] hover:text-[#26C65A]">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-[#2FD771] to-[#26C65A] text-[#0D1117] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">📞 Contactez Ralph Xpert</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Vous avez une question, un projet ou souhaitez simplement discuter ? Notre équipe est là pour vous accompagner.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl">
            <h2 className="text-[#2FD771] text-xl mb-4">💬 Envoyez-nous un message</h2>
            {message.content && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  message.type === "success"
                    ? "bg-gradient-to-r from-[#2FD771] to-[#26C65A] text-[#0D1117]"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                }`}
              >
                {message.content}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[#2FD771] mb-1">Nom complet *</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#21262D] border border-[#30363D] text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[#2FD771] mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#21262D] border border-[#30363D] text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[#2FD771] mb-1">Téléphone</label>
                <input
                  type="tel"
                  placeholder="+509 1234 5678"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#21262D] border border-[#30363D] text-white"
                />
              </div>
              <div>
                <label className="block text-[#2FD771] mb-1">Sujet *</label>
                <select
                  value={formData.sujet}
                  onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#21262D] border border-[#30363D] text-white"
                  required
                >
                  <option value="">Choisissez un sujet</option>
                  {subjects.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#2FD771] mb-1">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#21262D] border border-[#30363D] text-white min-h-[120px]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2FD771] to-[#26C65A] text-[#0D1117] font-bold hover:opacity-90 transition"
              >
                {isSubmitting ? "⏳ Envoi en cours..." : "📤 Envoyer le message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-4">
            <h2 className="text-[#2FD771] text-xl mb-4">📍 Nos coordonnées</h2>
            <div className="flex items-center gap-4 p-4 bg-[#21262D] rounded-lg border-l-4 border-[#2FD771]">
              <Mail className="w-6 h-6 text-[#2FD771]" />
              <div>
                <p className="text-white">elogekenguer@gmail.com</p>
                <small className="text-[#7D8590]">Réponse sous 24h</small>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#21262D] rounded-lg border-l-4 border-[#2FD771]">
              <Phone className="w-6 h-6 text-[#2FD771]" />
              <div>
                <p className="text-white">+1 849 459 7173</p>
                <small className="text-[#7D8590]">Lun-Ven 9h-18h</small>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[#161B22] border border-[#30363D] mt-8 p-6 rounded-2xl max-w-4xl mx-auto">
          <h2 className="text-[#2FD771] text-xl mb-4 text-center">❓ Questions fréquentes</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#30363D] py-2">
              <p className="text-[#2FD771] font-semibold">{faq.question}</p>
              <p className="text-[#C9D1D9]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
    }
