import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Target, Zap } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onGetStarted: () => void;
  compact?: boolean;
}

const features = [
  { icon: Brain, label: "AI Roadmaps" },
  { icon: Target, label: "Internship Match" },
  { icon: Zap, label: "Instant Results" },
  { icon: Sparkles, label: "Resume Tips" },
];

export default function HeroSection({
  onGetStarted,
  compact = false,
}: HeroSectionProps) {
  if (compact) {
    return (
      <header className="relative py-8 px-4 border-b border-border/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-cyan">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-lg text-gradient-cyan">
              Student Success AI
            </span>
          </div>
          <span className="text-muted-foreground text-sm hidden sm:block">
            Your Hackathon-Ready Career Assistant
          </span>
        </div>
      </header>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/assets/generated/hero-bg.dim_1920x1080.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-background/75" />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full blur-3xl z-0 animate-pulse-glow"
        style={{ background: "oklch(0.72 0.2 200 / 0.08)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/6 w-80 h-80 rounded-full blur-3xl z-0"
        style={{
          background: "oklch(0.55 0.22 290 / 0.06)",
          animationDelay: "1s",
        }}
      />

      {/* Nav bar */}
      <motion.nav
        className="absolute top-0 left-0 right-0 px-6 py-5 flex items-center justify-between z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center glow-cyan">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl text-gradient-cyan">
            Student Success AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground"
            >
              <Icon className="w-3 h-3 text-primary" />
              {label}
            </div>
          ))}
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Sparkles className="w-4 h-4 animate-pulse-glow" />
          AI-Powered Career Assistant for Students
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-gradient-title">Your Personalized</span>
          <br />
          <span className="text-foreground">Career Roadmap</span>
          <br />
          <span className="text-gradient-cyan">Starts Here</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Enter your branch, year, skills & interests. Get an AI-generated skill
          roadmap, internship domains, project ideas, study plan, and resume
          tips — all in seconds.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            size="lg"
            className="h-14 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan transition-all duration-300 hover:scale-105"
            onClick={onGetStarted}
            data-ocid="hero.primary_button"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            Get My Roadmap
          </Button>
          <p className="text-muted-foreground text-sm">
            Free • No signup required • Results in &lt;5 seconds
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {[
            { value: "5+", label: "Branches covered" },
            { value: "9+", label: "Career domains" },
            { value: "45+", label: "Project ideas" },
            { value: "24h", label: "Hackathon-ready" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient-cyan">
                {value}
              </div>
              <div className="text-muted-foreground text-xs mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <span>Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent animate-pulse-glow" />
      </motion.div>
    </section>
  );
}
