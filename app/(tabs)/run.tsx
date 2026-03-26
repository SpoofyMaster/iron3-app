import React, { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { DisciplineScreenView } from "@/components/DisciplineScreen";
import { getTriRank } from "@/lib/ranks";

export default function RunScreen() {
  const swimPoints = useAppStore((s) => s.swimPoints);
  const bikePoints = useAppStore((s) => s.bikePoints);
  const runPoints = useAppStore((s) => s.runPoints);
  const triRank = useMemo(() => getTriRank(swimPoints, bikePoints, runPoints), [swimPoints, bikePoints, runPoints]);
  const allActivities = useAppStore((s) => s.activities);
  const allPersonalBests = useAppStore((s) => s.personalBests);
  const activities = useMemo(() => allActivities.filter((a) => a.discipline === "run"), [allActivities]);
  const personalBests = useMemo(() => allPersonalBests.filter((pb) => pb.discipline === "run"), [allPersonalBests]);
  const rankHistory = useAppStore((s) => s.rankHistory);

  const historyPoints = rankHistory.map((h) => h.runPoints);
  const historyLabels = rankHistory.map((h) =>
    new Date(h.date).toLocaleDateString("en-US", { month: "short" })
  );

  return (
    <DisciplineScreenView
      discipline="run"
      rank={triRank.runRank}
      activities={activities}
      personalBests={personalBests}
      historyPoints={historyPoints}
      historyLabels={historyLabels}
    />
  );
}
