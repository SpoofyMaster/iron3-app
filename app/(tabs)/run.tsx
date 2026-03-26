import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { DisciplineScreenView } from "@/components/DisciplineScreen";

export default function RunScreen() {
  const triRank = useAppStore((s) => s.getTriRank());
  const activities = useAppStore((s) => s.getActivitiesForDiscipline("run"));
  const personalBests = useAppStore((s) =>
    s.getPersonalBestsForDiscipline("run")
  );
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
