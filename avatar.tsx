import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Calculator,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Lightbulb,
  Map as MapIcon,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { GeneratedData } from "../App";
import AttendanceCalculator from "./AttendanceCalculator";

interface ResultsDashboardProps {
  data: GeneratedData;
  onReset: () => void;
}

type TabId =
  | "roadmap"
  | "internships"
  | "projects"
  | "study"
  | "resume"
  | "attendance";

const TABS: {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "roadmap", label: "Skill Roadmap", icon: MapIcon },
  { id: "internships", label: "Internships", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Lightbulb },
  { id: "study", label: "Study Plan", icon: BookOpen },
  { id: "resume", label: "Resume Tips", icon: FileText },
  { id: "attendance", label: "Attendance", icon: Calculator },
];

// Domain descriptions
const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  "Full-Stack Web Development":
    "Build end-to-end web applications with modern frameworks and databases.",
  "Frontend Engineering":
    "Craft pixel-perfect, accessible, performant user interfaces.",
  "UI/UX Design":
    "Design intuitive user experiences using Figma, design systems, and research.",
  "Backend API Development":
    "Build scalable REST/GraphQL APIs with Node.js, Python, or Go.",
  "Machine Learning Engineering":
    "Train, evaluate and deploy ML models in production environments.",
  "Data Science & Analytics":
    "Extract insights from data using statistics, Python, and visualization tools.",
  "NLP Research":
    "Work on language models, text classification, chatbots and more.",
  "Computer Vision":
    "Build systems that understand images, videos, and visual data.",
  "Penetration Testing":
    "Legally hack systems to find and report vulnerabilities.",
  "SOC Analyst":
    "Monitor, detect, and respond to security incidents in real time.",
  "Application Security":
    "Audit and harden web/mobile apps against common attack vectors.",
  "Network Security":
    "Protect network infrastructure from intrusions and data breaches.",
  "Data Analytics":
    "Analyze business data and build dashboards for decision-making.",
  "Business Intelligence":
    "Turn raw data into meaningful reports using Tableau, Power BI, SQL.",
  "Data Engineering":
    "Build and maintain data pipelines, warehouses, and ETL processes.",
  "Android/iOS Development":
    "Create native mobile experiences for billions of smartphone users.",
  "React Native Development":
    "Build cross-platform mobile apps with a single JavaScript codebase.",
  "Mobile UI Engineering":
    "Craft beautiful, smooth mobile interfaces following platform guidelines.",
  "App Backend":
    "Design scalable backends for mobile apps — auth, APIs, push notifications.",
  "Unity Game Development":
    "Build immersive 2D/3D games using Unity engine and C#.",
  "Game Design":
    "Design compelling game mechanics, levels, and player experiences.",
  "AR/VR Development":
    "Create augmented and virtual reality experiences for mobile and headsets.",
  "Game Testing":
    "Ensure game quality through systematic QA, bug reporting, and playtesting.",
  "Cloud Solutions Architecture":
    "Design scalable, cost-efficient cloud infrastructure on AWS/GCP/Azure.",
  "DevOps Engineering":
    "Automate software delivery pipelines and infrastructure management.",
  "Site Reliability Engineering":
    "Maintain high availability and reliability of large-scale systems.",
  "Cloud Security":
    "Protect cloud workloads and data from misconfigurations and threats.",
  "Platform Engineering":
    "Build internal developer platforms to improve engineering productivity.",
  SRE: "Apply software engineering to operations for high reliability at scale.",
  "Cloud Infrastructure":
    "Provision and manage cloud resources with Terraform, Pulumi, and CDK.",
  "Robotics Engineering":
    "Design and program robots for industrial, medical, and consumer uses.",
  "Automation Engineering":
    "Automate industrial processes using PLCs, HMIs, and SCADA systems.",
  "Embedded Systems":
    "Program microcontrollers and FPGAs for hardware-driven applications.",
  "IoT Development":
    "Connect physical devices to the internet and build smart systems.",
};

export default function ResultsDashboard({
  data,
  onReset,
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("roadmap");
  const [checkedTips, setCheckedTips] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const { profile, suggestion } = data;

  const toggleTip = (i: number) => {
    setCheckedTips((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleCopyShare = () => {
    const text = `
🎯 My Student Success AI Roadmap
Branch: ${profile.branch} | Year: ${profile.year}
Skills: ${profile.skills.join(", ")}
Interests: ${profile.interests.join(", ")}

📍 Skill Roadmap:
${suggestion.skillRoadmap.map((s, i) => `${i + 1}. ${s}`).join("\n")}

💼 Internship Domains: ${suggestion.internshipDomains.join(", ")}
💡 Top Projects: ${suggestion.projectIdeas.slice(0, 3).join(", ")}

Generated with Student Success AI — caffeine.ai
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Roadmap summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-cyan">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-gradient-cyan">
                Student Success AI
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant="outline"
                  className="text-[10px] h-4 border-primary/30 text-primary px-1.5"
                >
                  {profile.branch}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] h-4 border-border text-muted-foreground px-1.5"
                >
                  Year {profile.year.toString()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground gap-1.5"
              onClick={handleCopyShare}
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Copied!" : "Share"}
              </span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-border hover:border-primary/50 gap-1.5"
              onClick={onReset}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Re-enter Details</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Success banner */}
        <motion.div
          className="glass-card rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 glow-cyan">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-xl text-gradient-title">
              Your Personalized Roadmap is Ready!
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Based on your profile —{" "}
              <span className="text-foreground">
                {profile.skills.join(", ")}
              </span>{" "}
              · interested in{" "}
              <span className="text-accent">
                {profile.interests.join(", ")}
              </span>
            </p>
          </div>
          <Button
            size="sm"
            className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 gap-1.5 flex-shrink-0"
            onClick={handleCopyShare}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy Summary"}
          </Button>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max border-b border-border/50 pb-0">
            {TABS.map(({ id, label, icon: Icon }, idx) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
                data-ocid={`results.tab.${idx + 1}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── Skill Roadmap ── */}
            {activeTab === "roadmap" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-6">
                  <MapIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Your Skill Roadmap
                  </h3>
                  <Badge className="bg-primary/10 text-primary border-primary/30 ml-auto">
                    {suggestion.skillRoadmap.length} steps
                  </Badge>
                </div>
                {suggestion.skillRoadmap.map((step, i) => (
                  <motion.div
                    key={step.slice(0, 30)}
                    className="relative flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    data-ocid={`results.item.${i + 1}`}
                  >
                    {/* Connector line */}
                    {i < suggestion.skillRoadmap.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-primary/40 to-primary/05" />
                    )}
                    {/* Step number */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-primary text-sm glow-cyan z-10">
                      {i + 1}
                    </div>
                    {/* Step content */}
                    <div className="flex-1 glass-card rounded-xl p-4 mb-2">
                      <p className="text-foreground/90 text-sm leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── Internship Domains ── */}
            {activeTab === "internships" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5 text-accent" />
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Recommended Internship Domains
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {suggestion.internshipDomains.map((domain, i) => (
                    <motion.div
                      key={domain}
                      className="glass-card rounded-xl p-5 border-accent/10 hover:border-accent/30 transition-all group cursor-default"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      data-ocid={`results.item.${i + 1}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-colors">
                          <Briefcase className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-foreground text-sm mb-1">
                            {domain}
                          </h4>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {DOMAIN_DESCRIPTIONS[domain] ||
                              "Explore this domain to find exciting career opportunities."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Project Ideas ── */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Project Ideas for Your Portfolio
                  </h3>
                </div>
                {suggestion.projectIdeas.map((idea, i) => {
                  const [title, desc] = idea.split(" — ");
                  return (
                    <motion.div
                      key={idea.slice(0, 30)}
                      className="glass-card rounded-xl p-5 hover:border-warning/30 transition-all group"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.35 }}
                      data-ocid={`results.item.${i + 1}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-warning/10 border border-warning/25 flex items-center justify-center text-warning font-display font-bold text-sm group-hover:bg-warning/20 transition-colors">
                          {String.fromCharCode(64 + i + 1)}
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-foreground mb-1">
                            {title}
                          </h4>
                          {desc && (
                            <p className="text-muted-foreground text-sm">
                              {desc}
                            </p>
                          )}
                          <div className="flex gap-2 mt-3">
                            <Badge
                              variant="outline"
                              className="text-xs border-warning/30 text-warning/80"
                            >
                              Portfolio Project
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs border-border/60 text-muted-foreground"
                            >
                              ~{2 + i} weeks
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ── Study Plan ── */}
            {activeTab === "study" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-success" />
                  <h3 className="font-display text-xl font-bold text-foreground">
                    4-Week Study Plan
                  </h3>
                </div>
                <div className="relative pl-6 border-l-2 border-success/20 space-y-6">
                  {suggestion.studyPlan.map((week, i) => {
                    const [header, ...rest] = week.split(" — ");
                    const weekLabel = header.startsWith("Week")
                      ? header
                      : `Week ${i + 1}`;
                    const content = header.startsWith("Week")
                      ? rest.join(" — ")
                      : week;
                    return (
                      <motion.div
                        key={week.slice(0, 25)}
                        className="relative"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.35 }}
                        data-ocid={`results.item.${i + 1}`}
                      >
                        {/* Dot */}
                        <div className="absolute -left-[1.65rem] top-3 w-4 h-4 rounded-full bg-background border-2 border-success/60 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-success" />
                        </div>
                        <div className="glass-card rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-success/10 text-success border-success/25 text-xs">
                              {weekLabel}
                            </Badge>
                          </div>
                          <p className="text-foreground/85 text-sm leading-relaxed">
                            {content}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Resume Tips ── */}
            {activeTab === "resume" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Resume Improvement Tips
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  Check off each tip as you apply it to your resume.
                </p>
                <div className="space-y-3">
                  {suggestion.resumeTips.map((tip, i) => (
                    <motion.div
                      key={tip.slice(0, 30)}
                      className={`glass-card rounded-xl p-4 flex items-start gap-4 transition-all cursor-pointer group ${
                        checkedTips.has(i)
                          ? "border-success/30 bg-success/5"
                          : "hover:border-primary/30"
                      }`}
                      onClick={() => toggleTip(i)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      data-ocid={`results.item.${i + 1}`}
                    >
                      <Checkbox
                        checked={checkedTips.has(i)}
                        onCheckedChange={() => toggleTip(i)}
                        className="mt-0.5 flex-shrink-0 border-primary/40 data-[state=checked]:bg-success data-[state=checked]:border-success"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <p
                        className={`text-sm leading-relaxed transition-colors ${
                          checkedTips.has(i)
                            ? "text-muted-foreground line-through"
                            : "text-foreground/90"
                        }`}
                      >
                        {tip}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {checkedTips.size > 0 && (
                  <motion.div
                    className="mt-4 p-3 rounded-xl bg-success/10 border border-success/25 text-success text-sm flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {checkedTips.size} of {suggestion.resumeTips.length} tips
                    applied — great work!
                  </motion.div>
                )}
              </div>
            )}

            {/* ── Attendance Calculator ── */}
            {activeTab === "attendance" && (
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <AttendanceCalculator />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <Separator className="my-10 border-border/40" />

        {/* Footer */}
        <footer className="text-center text-muted-foreground/60 text-xs pb-4">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </main>
    </div>
  );
}
