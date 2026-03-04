import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Calculator,
  CheckCircle,
  Loader2,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { AttendanceRisk } from "../backend.d";
import { useCalculateAttendanceRisk } from "../hooks/useQueries";

export default function AttendanceCalculator() {
  const [total, setTotal] = useState("");
  const [attended, setAttended] = useState("");
  const [remaining, setRemaining] = useState("");
  const [result, setResult] = useState<AttendanceRisk | null>(null);

  const calculateMutation = useCalculateAttendanceRisk();

  const handleCalculate = async () => {
    const t = Number.parseInt(total);
    const a = Number.parseInt(attended);
    const r = Number.parseInt(remaining);

    if (Number.isNaN(t) || Number.isNaN(a) || Number.isNaN(r)) return;
    if (a > t) return;

    try {
      const risk = await calculateMutation.mutateAsync({
        totalClasses: BigInt(t),
        attendedClasses: BigInt(a),
        remainingClasses: BigInt(r),
      });
      setResult(risk);
    } catch (err) {
      console.error(err);
    }
  };

  const getRiskConfig = (level: string) => {
    const l = level.toLowerCase();
    if (l === "safe" || l === "low") {
      return {
        color: "text-success",
        bg: "bg-success/10 border-success/30",
        icon: CheckCircle,
        label: "Safe",
        barColor: "bg-success",
      };
    }
    if (l === "warning" || l === "medium" || l === "moderate") {
      return {
        color: "text-warning",
        bg: "bg-warning/10 border-warning/30",
        icon: AlertTriangle,
        label: "Warning",
        barColor: "bg-warning",
      };
    }
    return {
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/30",
      icon: XCircle,
      label: "Critical",
      barColor: "bg-destructive",
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/30 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Attendance Risk Calculator
          </h3>
          <p className="text-muted-foreground text-sm">
            Check if you're at risk of dropping below 75%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">
            Total Classes
          </Label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="e.g. 60"
            min={0}
            className="w-full h-12 px-4 rounded-xl bg-muted/40 border border-border hover:border-primary/40 focus:border-primary/60 outline-none text-foreground text-sm transition-colors"
            data-ocid="attendance.total_input"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">
            Classes Attended
          </Label>
          <input
            type="number"
            value={attended}
            onChange={(e) => setAttended(e.target.value)}
            placeholder="e.g. 42"
            min={0}
            className="w-full h-12 px-4 rounded-xl bg-muted/40 border border-border hover:border-primary/40 focus:border-primary/60 outline-none text-foreground text-sm transition-colors"
            data-ocid="attendance.attended_input"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">
            Remaining Classes
          </Label>
          <input
            type="number"
            value={remaining}
            onChange={(e) => setRemaining(e.target.value)}
            placeholder="e.g. 10"
            min={0}
            className="w-full h-12 px-4 rounded-xl bg-muted/40 border border-border hover:border-primary/40 focus:border-primary/60 outline-none text-foreground text-sm transition-colors"
            data-ocid="attendance.remaining_input"
          />
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        disabled={
          calculateMutation.isPending || !total || !attended || !remaining
        }
        className="w-full h-11 bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30 hover:border-warning/50 transition-all font-medium"
        data-ocid="attendance.submit_button"
      >
        {calculateMutation.isPending ? (
          <>
            <Loader2
              className="mr-2 w-4 h-4 animate-spin"
              data-ocid="attendance.loading_state"
            />
            Calculating…
          </>
        ) : (
          <>
            <Calculator className="mr-2 w-4 h-4" />
            Calculate Risk
          </>
        )}
      </Button>

      {/* Error state */}
      {calculateMutation.isError && (
        <div
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2"
          data-ocid="attendance.error_state"
        >
          <XCircle className="w-4 h-4 flex-shrink-0" />
          Failed to calculate. Please check your inputs.
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && !calculateMutation.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            data-ocid="attendance.success_state"
          >
            {(() => {
              const config = getRiskConfig(result.riskLevel);
              const Icon = config.icon;
              const pct = Math.round(result.percentage * 100) / 100;
              const barWidth = Math.min(pct, 100);

              return (
                <div className={`p-5 rounded-xl border ${config.bg} space-y-4`}>
                  {/* Percentage + badge row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className={`font-display text-4xl font-bold ${config.color}`}
                      >
                        {pct.toFixed(1)}%
                      </div>
                      <div className="text-muted-foreground text-sm mt-1">
                        Current attendance
                      </div>
                    </div>
                    <Badge
                      className={`${config.bg} ${config.color} border-current gap-1.5 text-sm px-3 py-1.5`}
                    >
                      <Icon className="w-4 h-4" />
                      {config.label}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="text-warning">75% required</span>
                      <span>100%</span>
                    </div>
                    <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden">
                      {/* Required threshold marker */}
                      <div
                        className="absolute top-0 bottom-0 w-px bg-warning/70 z-10"
                        style={{ left: "75%" }}
                      />
                      <motion.div
                        className={`h-full rounded-full ${config.barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Classes needed */}
                  {Number(result.classesNeeded) > 0 ? (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                      <span className="text-foreground/80">
                        Attend{" "}
                        <strong className="text-warning">
                          {Number(result.classesNeeded)} more classes
                        </strong>{" "}
                        to reach 75% attendance
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span>You're above 75% — keep it up!</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
