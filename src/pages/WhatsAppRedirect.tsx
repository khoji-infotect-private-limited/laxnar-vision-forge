import { useEffect, useState, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=919140982008&text=Hello%2C%20Can%20you%20help%20me%20in%20making%20my%20idea%20into%20reality%3F";
const COUNTDOWN_MS = 3500;
const TICK_INTERVAL = 50;

const greetings = [
  { text: "Namaste 🙏", lang: "English" },
  { text: "नमस्ते", lang: "हिन्दी" },
  { text: "স্বাগতম", lang: "বাংলা" },
  { text: "स्वागतम्", lang: "संस्कृतम्" },
  { text: "స్వాగతం", lang: "తెలుగు" },
  { text: "ಸ್ವಾಗತ", lang: "ಕನ್ನಡ" },
  { text: "நல்வரவு", lang: "தமிழ்" },
];

const websiteThumbnails = [
  { title: "Portfolio", gradient: "from-cyan-500/20 to-blue-600/20", accent: "bg-cyan-400" },
  { title: "SaaS Landing", gradient: "from-violet-500/20 to-purple-600/20", accent: "bg-violet-400" },
  { title: "E-Commerce", gradient: "from-amber-500/20 to-orange-600/20", accent: "bg-amber-400" },
  { title: "Dashboard", gradient: "from-emerald-500/20 to-green-600/20", accent: "bg-emerald-400" },
  { title: "Blog", gradient: "from-rose-500/20 to-pink-600/20", accent: "bg-rose-400" },
  { title: "Agency", gradient: "from-sky-500/20 to-indigo-600/20", accent: "bg-sky-400" },
  { title: "Startup", gradient: "from-teal-500/20 to-cyan-600/20", accent: "bg-teal-400" },
  { title: "Restaurant", gradient: "from-red-500/20 to-orange-600/20", accent: "bg-red-400" },
];

const MinimalWebsiteCard = ({ title, gradient, accent }: { title: string; gradient: string; accent: string }) => (
  <div className={`flex-shrink-0 w-48 h-32 rounded-xl bg-gradient-to-br ${gradient} border border-white/10 p-3 flex flex-col justify-between`}>
    <div className="space-y-1.5">
      <div className={`w-5 h-5 rounded-md ${accent} opacity-80`} />
      <div className="w-3/4 h-1.5 rounded-full bg-white/20" />
      <div className="w-1/2 h-1.5 rounded-full bg-white/10" />
    </div>
    <div className="flex gap-1.5">
      <div className="w-full h-6 rounded-md bg-white/5" />
      <div className="w-full h-6 rounded-md bg-white/5" />
    </div>
    <p className="text-[10px] text-white/40 text-center">{title}</p>
  </div>
);

const WhatsAppRedirect = () => {
  const [elapsed, setElapsed] = useState(0);
  const [greetingIdx, setGreetingIdx] = useState(0);
  const redirected = useRef(false);

  const progress = Math.min((elapsed / COUNTDOWN_MS) * 100, 100);
  const secondsLeft = Math.max(Math.ceil((COUNTDOWN_MS - elapsed) / 1000), 0);

  // Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + TICK_INTERVAL;
        if (next >= COUNTDOWN_MS && !redirected.current) {
          redirected.current = true;
          window.location.href = WHATSAPP_URL;
        }
        return next;
      });
    }, TICK_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Cycle greetings
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIdx((i) => (i + 1) % greetings.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const doubled = [...websiteThumbnails, ...websiteThumbnails];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(220,60%,6%)] via-[hsl(220,50%,10%)] to-[hsl(220,60%,6%)] flex flex-col items-center justify-between px-4 py-10 text-white overflow-hidden">
      {/* Top spacer */}
      <div />

      {/* Greeting animation */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 my-8">
        <div className="h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={greetingIdx}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {greetings[greetingIdx].text}
              </p>
              <p className="text-xs text-white/40 mt-2 tracking-widest uppercase">
                {greetings[greetingIdx].lang}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="text-white/50 text-sm mt-4">We build beautiful digital experiences</p>
      </div>

      {/* Auto-scrolling thumbnails */}
      <div className="w-full max-w-4xl overflow-hidden mb-10">
        <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-4">Our work</p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[hsl(220,60%,6%)] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[hsl(220,60%,6%)] to-transparent z-10" />
          <motion.div
            className="flex gap-4"
            animate={{ x: [0, -(websiteThumbnails.length * (192 + 16))] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {doubled.map((t, i) => (
              <MinimalWebsiteCard key={i} {...t} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Timer section */}
      <div className="w-full max-w-md text-center space-y-4 mb-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
          <MessageCircle className="w-7 h-7 text-green-400" />
        </div>
        <p className="text-white/80 text-sm md:text-base">
          You're going to have a <span className="text-green-400 font-semibold">private conversation</span> with us soon.
        </p>
        <div className="space-y-2">
          <p className="text-white/40 text-xs">
            Redirecting in{" "}
            <span className="text-green-400 font-bold text-base">{secondsLeft}</span>{" "}
            second{secondsLeft !== 1 && "s"}…
          </p>
          <Progress value={progress} className="h-1 bg-white/10 [&>div]:bg-green-500" />
        </div>
      </div>

      <p className="text-white/20 text-[10px]">
        © {new Date().getFullYear()} Laxnar AI Innovations
      </p>
    </div>
  );
};

export default WhatsAppRedirect;
