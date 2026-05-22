"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Link from "next/link";

// Animated counter
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Floating orb
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Particle
function Particles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const items = Array.from({ length: 40 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setParticles(items as any);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p: any, i: number) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-400 rounded-full"
          style={{ left: p.left, top: p.top }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -60, -120] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// Animated feature card
function FeatureCard({ icon, title, desc, delay }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03, borderColor: "#6366f1" }}
      className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-6 cursor-default transition-colors"
    >
      <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// Typing animation
function TypingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    const speed = deleting ? 50 : 100;
    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1500);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
        return;
      }
      setText((t) => deleting ? t.slice(0, -1) : word.slice(0, t.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words]);

  return (
    <span className="text-indigo-400">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-8 bg-indigo-400 ml-1 align-middle"
      />
    </span>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { icon: "📄", title: "Upload Documents", desc: "Train your chatbot by uploading PDF files. It learns from your content instantly with RAG technology.", delay: 0 },
    { icon: "🤖", title: "AI-Powered Answers", desc: "Powered by Llama 3.3 via Groq. Blazing fast, accurate, and context-aware responses every time.", delay: 0.1 },
    { icon: "🌐", title: "Embed Anywhere", desc: "Copy one line of code and embed your chatbot on any website, landing page, or web app instantly.", delay: 0.2 },
    { icon: "💬", title: "Chat History", desc: "All conversations are saved automatically so you never lose context or important interactions.", delay: 0.3 },
    { icon: "🎨", title: "Custom Branding", desc: "Choose your chatbot's name, color, and personality to perfectly match your brand identity.", delay: 0.4 },
    { icon: "⚡", title: "Instant Setup", desc: "Create and deploy your AI chatbot in under 5 minutes. No technical skills or coding required.", delay: 0.5 },
  ];

  const steps = [
    { number: "01", title: "Create Your Bot", desc: "Sign up and create your chatbot with a name, personality, and custom color." },
    { number: "02", title: "Upload Documents", desc: "Upload your PDF files. Our AI instantly processes and learns from your content." },
    { number: "03", title: "Deploy & Embed", desc: "Copy the embed code and paste it into your website. Your bot is live instantly." },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "bg-gray-950/90 backdrop-blur border-b border-gray-800" : ""
        }`}
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">Z</div>
            <span className="text-xl font-bold">Zova <span className="text-indigo-400">AI</span></span>
          </Link>
        </motion.div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white transition text-sm">
            Login
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started Free</span>
              <motion.div
                className="absolute inset-0 bg-indigo-400 opacity-0 group-hover:opacity-20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-gray-950 to-gray-950 pointer-events-none" />
        <Orb className="w-96 h-96 bg-indigo-600 top-10 -left-20" />
        <Orb className="w-80 h-80 bg-purple-600 bottom-20 -right-10" />
        <Orb className="w-64 h-64 bg-blue-600 top-1/2 left-1/2 -translate-x-1/2" />
        <Particles />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm px-4 py-2 rounded-full mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            Powered by Llama 3.3 & Groq AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Build AI Chatbots
            <br />
            That{" "}
            <TypingText words={["Think Smart", "Learn Fast", "Work 24/7", "Scale Instantly"]} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your documents, train your AI chatbot instantly, and embed it
            anywhere. Built by{" "}
            <span className="text-indigo-400 font-semibold">Farhan</span> for
            businesses that demand more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup"
                className="relative bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition text-lg group overflow-hidden inline-block"
              >
                <span className="relative z-10">Start for Free →</span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
                />
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity -z-10" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className="border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition text-lg inline-block"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500"
          >
            {["No credit card required", "Free to start", "Deploy in minutes"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-green-400">✓</span> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-2 bg-indigo-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 500, suffix: "+", label: "Chatbots Created" },
            { value: 10000, suffix: "+", label: "Messages Handled" },
            { value: 99, suffix: "%", label: "Uptime" },
            { value: 5, suffix: "min", label: "Setup Time" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-4xl font-extrabold text-indigo-400 mb-1">
                <Counter target={stat.value} />{stat.suffix}
              </p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-indigo-400 text-sm font-semibold mb-3 uppercase tracking-widest">How It Works</p>
            <h2 className="text-4xl font-bold">Up and running in 3 steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600" />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative text-center p-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-400 mx-auto mb-4"
                >
                  {step.number}
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-indigo-400 text-sm font-semibold mb-3 uppercase tracking-widest">Features</p>
            <h2 className="text-4xl font-bold">Everything you need to succeed</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <Orb className="w-96 h-96 bg-indigo-700 top-0 left-1/2 -translate-x-1/2" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h2 className="text-5xl font-extrabold mb-6">
            Ready to build your
            <br />
            <span className="text-indigo-400">AI chatbot?</span>
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join hundreds of businesses using Zova AI to automate customer support and engagement.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/signup"
              className="relative inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition"
            >
              Create Free Account →
              <div className="absolute -inset-1 bg-indigo-600 rounded-xl blur opacity-40 -z-10" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">Z</div>
            <span className="font-bold">Zova <span className="text-indigo-400">AI</span></span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 Zova AI. Built with ❤️ by{" "}
            <span className="text-indigo-400 font-semibold">Farhan</span>
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-white transition">Login</Link>
            <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}