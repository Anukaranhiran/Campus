import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Loader2, Plus, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type KeyboardEvent, useRef, useState } from "react";
import { toast } from "sonner";
import type { GeneratedData } from "../App";
import { useAddCareerSuggestion, useAddStudent } from "../hooks/useQueries";
import { generateSuggestions } from "../utils/suggestions";

const BRANCH_OPTIONS = ["CS", "IT", "Civil", "Mechanical", "Electronics"];
const YEAR_OPTIONS = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
];

const SKILL_SUGGESTIONS = [
  "HTML",
  "CSS",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
  "Firebase",
  "UI/UX",
];

const INTEREST_SUGGESTIONS = [
  "Web Dev",
  "AI/ML",
  "Cybersecurity",
  "Data Science",
  "App Dev",
  "Game Dev",
  "Cloud",
  "DevOps",
  "Robotics",
];

interface StudentFormProps {
  onComplete: (data: GeneratedData) => void;
}

export default function StudentForm({ onComplete }: StudentFormProps) {
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const skillInputRef = useRef<HTMLInputElement>(null);
  const interestInputRef = useRef<HTMLInputElement>(null);

  const addStudentMutation = useAddStudent();
  const addSuggestionMutation = useAddCareerSuggestion();

  const addTag = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
    inputSetter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const trimmed = value.trim();
    if (trimmed && !current.includes(trimmed)) {
      setter([...current, trimmed]);
    }
    inputSetter("");
  };

  const removeTag = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => prev.filter((t) => t !== value));
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
    inputSetter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value, setter, current, inputSetter);
    }
    if (e.key === "Backspace" && !value && current.length > 0) {
      setter(current.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (!branch) {
      toast.error("Please select your branch");
      return;
    }
    if (!year) {
      toast.error("Please select your year");
      return;
    }
    if (skills.length === 0) {
      toast.error("Add at least one skill");
      return;
    }
    if (interests.length === 0) {
      toast.error("Add at least one interest");
      return;
    }

    setIsGenerating(true);

    try {
      const studentId = crypto.randomUUID();
      const yearNum = Number.parseInt(year);

      const profile = {
        id: studentId,
        branch,
        year: BigInt(yearNum),
        skills,
        interests,
      };

      const suggestion = generateSuggestions(
        branch,
        yearNum,
        skills,
        interests,
      );

      // Parallel calls to backend
      await Promise.all([
        addStudentMutation.mutateAsync(profile),
        addSuggestionMutation.mutateAsync({ studentId, suggestion }),
      ]);

      toast.success("Roadmap generated! Redirecting…");
      onComplete({ profile, suggestion });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-title mb-3">
            Tell Us About Yourself
          </h2>
          <p className="text-muted-foreground">
            Answer 4 quick questions and we'll generate your personalized
            roadmap
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="glass-card rounded-2xl p-8 space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Branch */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                1
              </span>
              Branch / Department
            </Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger
                className="h-12 bg-muted/50 border-border hover:border-primary/50 transition-colors"
                data-ocid="form.branch_select"
              >
                <SelectValue placeholder="Select your branch…" />
              </SelectTrigger>
              <SelectContent>
                {BRANCH_OPTIONS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                2
              </span>
              Current Year
            </Label>
            <div
              className="grid grid-cols-4 gap-2"
              data-ocid="form.year_select"
            >
              {YEAR_OPTIONS.map(({ value: v, label }) => (
                <button
                  key={v}
                  type="button"
                  className={`h-12 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    year === v
                      ? "border-primary bg-primary/20 text-primary glow-cyan"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                  onClick={() => setYear(v)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                3
              </span>
              Skills You Know
            </Label>

            {/* Tags display */}
            <div className="min-h-12 p-3 rounded-xl bg-muted/30 border border-border hover:border-primary/40 transition-colors flex flex-wrap gap-2 focus-within:border-primary/60">
              <AnimatePresence>
                {skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 gap-1 pr-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeTag(skill, setSkills)}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex items-center gap-1 flex-1 min-w-32">
                <input
                  ref={skillInputRef}
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      skillInput,
                      setSkills,
                      skills,
                      setSkillInput,
                    )
                  }
                  placeholder={
                    skills.length === 0
                      ? "Type a skill & press Enter…"
                      : "Add more…"
                  }
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
                  data-ocid="form.skills_input"
                />
                <button
                  type="button"
                  onClick={() =>
                    addTag(skillInput, setSkills, skills, setSkillInput)
                  }
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Skill suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="px-2.5 py-1 rounded-full text-xs border border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
                  onClick={() => addTag(s, setSkills, skills, setSkillInput)}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold">
                4
              </span>
              Career Interests
            </Label>

            <div className="min-h-12 p-3 rounded-xl bg-muted/30 border border-border hover:border-accent/40 transition-colors flex flex-wrap gap-2 focus-within:border-accent/60">
              <AnimatePresence>
                {interests.map((interest) => (
                  <motion.div
                    key={interest}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 gap-1 pr-1">
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeTag(interest, setInterests)}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex items-center gap-1 flex-1 min-w-32">
                <input
                  ref={interestInputRef}
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      interestInput,
                      setInterests,
                      interests,
                      setInterestInput,
                    )
                  }
                  placeholder={
                    interests.length === 0
                      ? "Type an interest & press Enter…"
                      : "Add more…"
                  }
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
                  data-ocid="form.interests_input"
                />
                <button
                  type="button"
                  onClick={() =>
                    addTag(
                      interestInput,
                      setInterests,
                      interests,
                      setInterestInput,
                    )
                  }
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {INTEREST_SUGGESTIONS.filter((s) => !interests.includes(s)).map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    className="px-2.5 py-1 rounded-full text-xs border border-border/60 text-muted-foreground hover:border-accent/50 hover:text-accent transition-all"
                    onClick={() =>
                      addTag(s, setInterests, interests, setInterestInput)
                    }
                  >
                    + {s}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Submit */}
          <Button
            size="lg"
            className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
            onClick={handleSubmit}
            disabled={isGenerating}
            data-ocid="form.submit_button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Generating your roadmap…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-5 h-5" />
                Generate My Roadmap
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>

          <p className="text-center text-muted-foreground text-xs">
            Your data is stored on the Internet Computer blockchain. No emails,
            no spam.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
