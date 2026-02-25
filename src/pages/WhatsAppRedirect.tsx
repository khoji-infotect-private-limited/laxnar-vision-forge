import { useEffect, useState } from "react";
import { Globe, Smartphone, Brain, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=919140982008";
const COUNTDOWN_SECONDS = 5;

const services = [
  {
    icon: Globe,
    title: "Web Development",
    desc: "Modern, responsive websites & web apps built with cutting-edge AI tools.",
  },
  {
    icon: Smartphone,
    title: "Android Apps",
    desc: "Native Android applications from MVP to production-ready, powered by AI.",
  },
  {
    icon: Brain,
    title: "AI Solutions",
    desc: "Custom machine learning models, NLP, computer vision & predictive analytics.",
  },
];

const WhatsAppRedirect = () => {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const progress = ((COUNTDOWN_SECONDS - seconds) / COUNTDOWN_SECONDS) * 100;

  useEffect(() => {
    if (seconds <= 0) {
      window.location.href = WHATSAPP_URL;
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(220,60%,8%)] via-[hsl(220,50%,12%)] to-[hsl(220,60%,8%)] flex flex-col items-center justify-center px-4 py-12 text-white">
      {/* Logo & brand */}
      <Link to="/" className="mb-6">
        <img
          src="/lovable-uploads/4f8610eb-6b18-41eb-b5f3-6dabcc4cd82a.png"
          alt="Laxnar AI Innovations"
          className="h-14 w-auto"
        />
      </Link>

      {/* Redirect card */}
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-green-400" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold">
          Connecting you to Laxnar&nbsp;AI
        </h1>

        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          We build <span className="text-white font-medium">websites</span>,{" "}
          <span className="text-white font-medium">Android apps</span> &{" "}
          <span className="text-white font-medium">custom AI solutions</span>{" "}
          for businesses — fast delivery, competitive pricing, powered by the latest AI tools.
        </p>

        {/* Countdown */}
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">
            Redirecting to WhatsApp in{" "}
            <span className="text-green-400 font-bold text-lg">{seconds}</span>{" "}
            second{seconds !== 1 && "s"}…
          </p>
          <Progress value={progress} className="h-1.5 bg-white/10 [&>div]:bg-green-500" />
        </div>

        <Button
          onClick={() => (window.location.href = WHATSAPP_URL)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-5 text-base gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Open WhatsApp Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Services strip */}
      <div className="mt-10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-white/10 bg-white/5 p-5 text-center space-y-2"
          >
            <s.icon className="w-7 h-7 mx-auto text-blue-400" />
            <h3 className="font-semibold text-sm">{s.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-gray-500 text-xs">
        © {new Date().getFullYear()} Laxnar AI Innovations
      </p>
    </div>
  );
};

export default WhatsAppRedirect;
