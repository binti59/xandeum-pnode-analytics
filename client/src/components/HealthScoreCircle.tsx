import { getHealthColor, getHealthBgColor, getHealthLabel } from "@/lib/healthScore";
import { motion } from "framer-motion";

interface HealthScoreCircleProps {
  score: number;
  availabilityScore: number;
  versionHealthScore: number;
  distributionScore: number;
}

export function HealthScoreCircle({
  score,
  availabilityScore,
  versionHealthScore,
  distributionScore,
}: HealthScoreCircleProps) {
  const circumference = 2 * Math.PI * 90; // radius = 90
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-white/10"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className={getHealthColor(score)}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-center"
          >
            <div className={`text-5xl font-bold ${getHealthColor(score)}`}>
              {score}
            </div>
            <div className="text-sm uppercase tracking-wide text-muted-foreground mt-1">
              {getHealthLabel(score)}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mt-6 w-full space-y-3">
        <ScoreBar label="Availability" score={availabilityScore} weight={40} />
        <ScoreBar label="Version Health" score={versionHealthScore} weight={35} />
        <ScoreBar label="Distribution" score={distributionScore} weight={25} />
      </div>

      {/* Formula */}
      <div className="mt-4 text-xs text-muted-foreground font-mono text-center">
        {score} = ({availabilityScore}×40%) + ({versionHealthScore}×35%) + ({distributionScore}×25%)
      </div>
    </div>
  );
}

function ScoreBar({ label, score, weight }: { label: string; score: number; weight: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-bold ${getHealthColor(score)}`}>{score}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-full ${getHealthBgColor(score)}`}
        />
      </div>
    </div>
  );
}
