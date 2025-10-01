import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Upload,
  Users,
  Star,
  Phone,
  MessageCircle,
  Mail,
  Plus,
  Minus,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- FAQ Data ---
const faqData = [
  {
    question: "Comment mes vues vont-elles augmenter avec Ralph Xpert ?",
    answer:
      "En exportant vos contacts au format VCF et en le partageant, vous permettez à de nombreuses personnes d’enregistrer votre numéro en même temps. Lorsqu’elles consultent votre statut WhatsApp, vous obtenez plus de vues, ce qui aide à développer votre audience",
  },
  {
    question: "Mon compte WhatsApp est-il sûr?",
    answer:
      "Oui, votre compte est 100 % sécurisé. Ce service ne nécessite pas l’accès à votre compte WhatsApp ni à aucune information personnelle. Il fonctionne uniquement avec les contacts que vous choisissez de télécharger et d’exporter.",
  },
  {
    question: "C'est gratuit?",
    answer:
      "Oui, les fonctionnalités principales de collecte de contacts et d’exportation en fichier VCF sont entièrement gratuites. Nous croyons en l’aide à la croissance de votre communauté sans obstacles.",
  },
  {
    question: "Est-ce que cela fonctionne dans tous les pays ?",
    answer:
      "Absolument. Tant que votre smartphone ou appareil peut importer un fichier de contacts .vcf standard, notre service fonctionnera pour vous, peu importe où vous êtes dans le monde.",
  },
];

export default function Home() {
  const [count, setCount] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchCount() {
      try {
        const res = await fetch("/api/contacts/count");
        const json = await res.json();
        if (mounted && json?.count !== undefined) setCount(json.count);
      } catch {}
    }
    fetchCount();
    const t = setInterval(fetchCount, 5000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  const testimonials = [
    {
      name: "the king",
      role: "Designer Produit",
      result:
        "J'ai reçu mon fichier VCF immédiatement et sans aucune complication. Cela m'a permis d'ajouter facilement tous mes contacts à mon téléphone et de commencer à partager mon numéro avec ma communauté. Le processus était clair et rapide, ce qui m'a vraiment fait gagner du temps.",
      rating: 5,
    },
    {
      name: "kerventz",
      role: "Ingénieur Logiciel",
      result:
        "Grâce au fichier VCF de Ralph, j'ai pu développer efficacement mon audience WhatsApp. La facilité d'importation des contacts m'a permis de me concentrer sur la création de contenu et d'engager mes contacts sans perdre de temps à ajouter manuellement chaque numéro. C'est un outil fiable et pratique.",
      rating: 5,
    },
    {
      name: "Camille",
      role: "Marketeuse",
      result:
        "La communauté est très active et engagée grâce à cette fonctionnalité. Le fichier VCF m'a permis de partager rapidement mes contacts avec mes collaborateurs et mes clients, et j'ai constaté une nette augmentation des interactions et des vues sur mes statuts WhatsApp. Cela a vraiment boosté mon marketing digital.",
      rating: 4,
    },
    {
      name: "Joseph",
      role: "Entrepreneur",
      result:
        "Mes vues sur WhatsApp ont considérablement augmenté depuis que j'utilise le fichier VCF de Ralph. Tous mes contacts ont été ajoutés facilement, et j'ai pu toucher un public beaucoup plus large que jamais. Ce service est simple, rapide et fiable, et il a un impact réel sur le développement de mon entreprise.",
      rating: 5,
    },
  ];

  const handleFaqToggle = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* HERO SECTION */}
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient bg-clip-text text-transparent from-blue-400 via-indigo-500 to-purple-500 bg-gradient-to-r">
            Welcome to Ralph Xpert VCF
          </h1>
          <p className="text-gray-700 mt-4">
            Bienvenue dans la communauté Ralph Xpert ! 🌟 Nous allons vous aider à obtenir plus de visibilité. Suivez les instructions et augmentez facilement vos vues.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-indigo-100 to-purple-50 shadow-lg"
        >
          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-md">
            <div className="text-sm text-gray-600">Total Contacts</div>
            <div className="text-xl font-semibold mt-2">{count}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-md">
            <div className="text-sm text-gray-600">Export</div>
            <div className="text-xl font-semibold mt-2">VCF / PDF</div>
          </div>
          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-md">
            <div className="text-sm text-gray-600">Theme</div>
            <div className="text-xl font-semibold mt-2">Light • Blue</div>
          </div>
        </motion.div>
      </div>

      {/* UPLOAD BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <Link
          href="/upload"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Upload size={18} /> 📝 S'inscrire maintenant / Upload
        </Link>
      </motion.div>

      {/* TESTIMONIALS SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {testimonials.map((t) => (
            <motion.div whileHover={{ y: -6 }} key={t.name} className="p-5 rounded-2xl bg-indigo-50 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.role}</div>
                </div>
                <div className="inline-flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">{t.result}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CONTACT BUTTON SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20"
      >
        <div className="bg-blue-500 text-center py-10 rounded-2xl shadow">
          <h2 className="text-3xl font-bold flex justify-center items-center gap-2 text-white">
            <Phone /> Contact Ralph Xpert
          </h2>
          <p className="text-white mt-3 max-w-2xl mx-auto">
            Une question, un projet ou juste envie de discuter ? Notre équipe vous accompagne dans votre croissance digitale !
          </p>
        </div>

        <div className="p-8 rounded-2xl text-center bg-indigo-50 shadow mt-8">
          <h3 className="text-xl font-semibold flex justify-center items-center gap-2 text-blue-600">
            <MessageCircle /> Contacter nous dès maintenant
          </h3>
          <p className="text-gray-700 mb-6">
            Contactez notre équipe dès maintenant en cliquant sur le bouton ci-dessous.
          </p>

          <Link
            href="/contact"
            className="bg-blue-500 w-full py-3 rounded-xl font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2 inline-block text-white"
          >
            📞 Contacter nous
          </Link>
        </div>
      </motion.div>

      {/* FAQ SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="p-8 rounded-2xl bg-indigo-50 shadow mt-16"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                onClick={() => handleFaqToggle(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="font-semibold text-lg text-gray-800">{faq.question}</span>
                {openFaqIndex === index ? (
                  <Minus className="text-blue-500" />
                ) : (
                  <Plus className="text-blue-500" />
                )}
              </button>
              <AnimatePresence>
                {openFaqIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white rounded-lg text-gray-700">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 mt-20 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h2 className="font-bold text-xl mb-4">RALPH XPERT PROGRAMME</h2>
              <p className="text-sm">
                La plateforme de référence pour développer votre réseau WhatsApp et maximiser l'impact de vos statuts.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>Boost de contacts</li>
                <li>Vues de statut</li>
                <li>Analytics avancées</li>
                <li>Formation premium</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact & Support</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:elogekenguer@gmail.com" className="hover:text-gray-200">
                    elogekenguer@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+18494597173" className="hover:text-gray-200">
                    +1 849 459 7173
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <a
                    href="https://wa.me/18494597173"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-200"
                  >
                    WhatsApp 24/7 Disponible
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-200 border-t border-gray-400">
            <span>© 2025 RALPH XPERT PROGRAMME. Tous droits réservés.</span>
            <span>
              Créé par <strong>Mr RALPH</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
                                }
